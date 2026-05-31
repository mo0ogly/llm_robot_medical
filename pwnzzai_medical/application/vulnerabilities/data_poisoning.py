from application.model import PatientFeedback
from sqlalchemy.exc import OperationalError, ProgrammingError


def _comments_from_db():
    """Return treatment feedbacks for the lab, or [] if the DB is missing tables (e.g. not migrated)."""
    try:
        return list(PatientFeedback.query.all())
    except (OperationalError, ProgrammingError):
        return []


def create_sentiment_model():
     # Get all the existing feedbacks to display
    feedbacks = _comments_from_db()
    
    # Create training data for the initial model
    training_texts = []
    training_labels = []
    
    # Add existing feedbacks to training data
    for patient_feedback in feedbacks:
        training_texts.append(patient_feedback.content)
        # Convert 5-star rating to binary sentiment (3+ stars is positive)
        training_labels.append(1 if patient_feedback.rating >= 3 else 0)
    
    # Check if we have at least one sample from each class
    class_0_exists = 0 in training_labels
    class_1_exists = 1 in training_labels
    
    # Ensure we have at least one sample of each class to prevent LogisticRegression errors
    if not class_0_exists:
        training_texts.append("This is a negative patient_feedback added to ensure model can train")
        training_labels.append(0)
    
    if not class_1_exists:
        training_texts.append("This is a positive patient_feedback added to ensure model can train")
        training_labels.append(1)
    
    # Train an initial model to display
    from sklearn.feature_extraction.text import CountVectorizer
    from sklearn.linear_model import LogisticRegression
    
    # Create and train the model
    vectorizer = CountVectorizer(max_features=100)
    X = vectorizer.fit_transform(training_texts)
    model = LogisticRegression(C=10.0)
    model.fit(X, training_labels)
    
    # Get the model weights
    vocabulary = vectorizer.get_feature_names_out()
    coefficients = model.coef_[0]
    
    # Sort words by importance
    word_weights = {}
    for word, coef in zip(vocabulary, coefficients):
        word_weights[word] = float(coef)
        
    word_importance = sorted(word_weights.items(), key=lambda x: abs(x[1]), reverse=True)
    top_positive = [item for item in word_importance if item[1] > 0][:10]
    top_negative = [item for item in word_importance if item[1] < 0][:10]
    
    # Format feedbacks for display
    formatted_comments = []
    for patient_feedback in feedbacks:
        formatted_comments.append({
            'text': patient_feedback.content,
            'rating': patient_feedback.rating,
            'name': patient_feedback.name,
            'sentiment': 'positive' if patient_feedback.rating >= 3 else 'negative'
        })
    
    # Create a dictionary with model data to pass to the template
    model_data = {
        'top_positive_words': top_positive,
        'top_negative_words': top_negative,
        'all_weights': word_weights,
        'training_size': len(training_texts),
        'feedbacks': formatted_comments
    }
    return model_data

    
def create_new_model_with_poisoned_data(user_comments):
    
        # Get all treatment feedbacks from the database as base data
        db_comments = _comments_from_db()
        training_texts = []
        training_labels = []
        
        # Add existing feedbacks to training data
        for patient_feedback in db_comments:
            training_texts.append(patient_feedback.content)
            # Convert 5-star rating to binary sentiment (3+ stars is positive)
            training_labels.append(1 if patient_feedback.rating >= 3 else 0)
        
        # Add user feedbacks to training data (potential poisoning)
        for patient_feedback in user_comments:
            training_texts.append(patient_feedback['text'])
            training_labels.append(1 if patient_feedback['sentiment'] == 'positive' else 0)
            
        # Log the training data
        logs = []
        logs.append(f"Training with {len(training_texts)} feedbacks ({len(db_comments)} from database, {len(user_comments)} from user)")
        
        # Check if we have at least one sample from each class (0 and 1)
        # This prevents the LogisticRegression ValueError when only one class is present
        class_0_exists = 0 in training_labels
        class_1_exists = 1 in training_labels
        
        if not (class_0_exists and class_1_exists):
            logs.append("Warning: Training data doesn't have samples from both classes")
            
            # Add a default sample for any missing class to ensure model can train
            if not class_0_exists:
                training_texts.append("This is a negative patient_feedback added to ensure model can train")
                training_labels.append(0)
                logs.append("Added a default negative sample")
                
            if not class_1_exists:
                training_texts.append("This is a positive patient_feedback added to ensure model can train")
                training_labels.append(1)
                logs.append("Added a default positive sample")
        
        # Train a new model with this data
        from sklearn.feature_extraction.text import CountVectorizer
        from sklearn.linear_model import LogisticRegression
        
        # Create and train the model
        vectorizer = CountVectorizer(max_features=100)
        X = vectorizer.fit_transform(training_texts)
        model = LogisticRegression(C=10.0)
        model.fit(X, training_labels)
        
        # Get the model weights
        vocabulary = vectorizer.get_feature_names_out()
        coefficients = model.coef_[0]
        
        # Sort words by importance
        word_weights = {}
        for word, coef in zip(vocabulary, coefficients):
            word_weights[word] = float(coef)
            
        word_importance = sorted(word_weights.items(), key=lambda x: abs(x[1]), reverse=True)
        top_positive = [item for item in word_importance if item[1] > 0][:10]
        top_negative = [item for item in word_importance if item[1] < 0][:10]
        
        # Create model_data response
        model_data = {
            "model_name": "Poisoned Sentiment Model",
            "training_size": len(training_texts),
            "poisoning_size": len(user_comments),
            "vocabulary_size": len(vocabulary),
            "top_positive_words": top_positive,
            "top_negative_words": top_negative,
            "all_weights": word_weights,
            "user_comments": user_comments,
            "logs": logs
        }
        return model_data
    
    
def test_model(text, weights):
    
        # Recreate a simplified model based on provided weights
        from sklearn.feature_extraction.text import CountVectorizer
        
        # Create a vocabulary from the weights keys
        vocabulary = list(weights.keys())
        
        # Create a simple vectorizer with this vocabulary
        vectorizer = CountVectorizer(vocabulary=vocabulary)
        
        # Vectorize the test text
        X = vectorizer.transform([text])
        
        # Create a simple prediction function
        feature_names = vectorizer.get_feature_names_out()
        
        # Calculate logit score manually
        score = 0.0
        for i, feature in enumerate(feature_names):
            if X[0, i] > 0 and feature in weights:
                score += weights[feature]
        
        # Apply sigmoid to get probability
        import math
        probability = 1 / (1 + math.exp(-score))
        
        # Determine sentiment
        sentiment = "positive" if probability >= 0.5 else "negative"
        confidence = max(probability, 1 - probability)


        return sentiment, confidence, score, probability