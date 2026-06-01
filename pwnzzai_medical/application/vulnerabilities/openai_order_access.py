import re
from flask import  session
from application.model import Appointment
from application.provider_config import lab_cloud_llm_model_default, llm_ui_snapshot

def extract_username_from_prompt(prompt):
    """Extract username from user prompt"""
   
    # Look for common patterns where users mention names
    patterns = [
        r"for\s+user\s+(\w+)",
        r"user\s+(\w+)",
        r"username\s+(\w+)",
        r"for\s+(\w+)",
        r"about\s+(\w+)",
        r"(\w+)'s\s+appointments",
        r"appointments\s+for\s+(\w+)"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, prompt, re.IGNORECASE)
        if match:
            return match.group(1)
    
    return None

def get_user_orders_data(target_username=None):
    """Get user's order data from the database - VULNERABLE: can access any user's data"""
    try:
        from application.model import User
        
        if target_username:
            # VULNERABLE: Look up any user by username from prompt
            user = User.query.filter_by(username=target_username).first()
            if not user:
                return f"User '{target_username}' not found in the system."
            
            user_id = user.id
            username = user.username
        else:
            # Default to current session user
            if 'user_id' not in session:
                return "No user logged in"
            
            user_id = session['user_id']
            user = User.query.get(user_id)
            username = user.username if user else "Unknown User"
        
        appointments = Appointment.query.filter_by(user_id=user_id).order_by(Appointment.created_at.desc()).all()
        if not appointments:
            return f"User '{username}' has no previous appointments."
        
        orders_text = f"User: {username}\n"
        orders_text += f"Appointment history ({len(appointments)} appointments):\n"
        for i, order in enumerate(appointments, 1):
            orders_text += f"{i}. {order.treatment.name} - Quantity: {order.quantity} - Total: ${order.total_price:.2f} - Date: {order.created_at.strftime('%Y-%m-%d %H:%M')}\n"
        
        return orders_text
    except Exception as e:
        return f"Error accessing order data: {e}"

def query_openai_with_orders(user_query, api_token):
    """Query cloud LLM with access to user appointments"""
    try:
        from application.llm_chat import chat_completion

        # Extract username from prompt (VULNERABLE)
        target_username = extract_username_from_prompt(user_query)
        
        # Get user's order history (potentially for any user)
        orders_context = get_user_orders_data(target_username)
        
        # Create system prompt with order access (VULNERABLE)
        system_prompt = f"""You are a helpful treatment shop assistant. You have access to the user's order history:

{orders_context}

Answer questions about the user's appointments based on this information. Be helpful and provide details when asked about their previous appointments."""

        llm_response = chat_completion(
            [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ],
            api_key=api_token,
            model=lab_cloud_llm_model_default(),
            max_tokens=300,
            temperature=0.7,
        )
        if llm_response.startswith("Error:"):
            return llm_response, False
        return llm_response, True
        
    except Exception as e:
        name = llm_ui_snapshot()["provider_name"]
        return f"Error connecting to {name}: {str(e)}", False

def detect_order_access(response):
    """Detect if order information was disclosed in the response"""
    accessed_info = []
    
    # Check for user identification
    if "user:" in response.lower():
        accessed_info.append({"type": "User Identity", "content": "User identity revealed"})
    
    # Check for specific usernames
    usernames = ["alice", "bob", "admin", "user"]
    for username in usernames:
        if username.lower() in response.lower():
            accessed_info.append({"type": "Username Disclosure", "content": f"Username revealed: {username}"})
    
    # Check for order-related information patterns
    if "order history" in response.lower():
        accessed_info.append({"type": "Appointment History", "content": "Appointment history accessed"})
    
    if "quantity:" in response.lower() or "qty:" in response.lower():
        accessed_info.append({"type": "Appointment Details", "content": "Appointment quantities revealed"})
    
    if "$" in response and ("total" in response.lower() or "price" in response.lower()):
        accessed_info.append({"type": "Financial Data", "content": "Appointment prices revealed"})
    
    # Check for specific dates
    if any(year in response for year in ["2023", "2024", "2025"]):
        accessed_info.append({"type": "Temporal Data", "content": "Appointment dates revealed"})
    
    # Check for treatment names in appointments
    treatment_names = ["consultation", "blood_test", "mri", "ultrasound", "xray"]
    for treatment in treatment_names:
        if treatment.lower() in response.lower():
            accessed_info.append({"type": "Purchase History", "content": f"Treatment purchase revealed: {treatment}"})
    
    return accessed_info