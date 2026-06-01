import sqlite3
import json
from datetime import datetime
from application.llm_chat import chat_completion
from application.provider_config import lab_cloud_llm_model_excessive_agency
from application.model import User, Treatment
from flask import session
from sqlalchemy import func


def openai_chat(prompt: str, api_key: str) -> str:
    """Wrapper around cloud LLM chat completion with explicit API key"""
    text = chat_completion(
        [{"role": "user", "content": prompt}],
        api_key=api_key,
        model=lab_cloud_llm_model_excessive_agency(),
        temperature=0.2,
    )
    return text.strip()


def extract_order(order_text: str, api_key: str):
    """Use LLM to parse order into structured JSON"""
    prompt = f"""
    Extract structured information from this treatment order.
    Required fields: username, treatment, quantity.
    When the username is not defined return null for it.
    Return ONLY valid JSON without any markdown formatting or code blocks.

    Example:
    Input: "My name is Bob and I want 3 margherita treatments"
    Output: {{"username": "Bob", "treatment": "margherita", "quantity": 3}}

    Input: "{order_text}"
    """
    response = openai_chat(prompt, api_key)

    # Clean the response - remove markdown code blocks if present
    response = response.strip()
    if response.startswith("```json"):
        response = response[7:]  # Remove ```json
    if response.startswith("```"):
        response = response[3:]  # Remove ```
    if response.endswith("```"):
        response = response[:-3]  # Remove trailing ```
    response = response.strip()

    return json.loads(response)


def place_order(order_text: str, api_key: str):
    conn = None
    try:
        #  Extract order details with LLM
        order_info = extract_order(order_text, api_key)
        print ("order info", order_info)

        username = order_info["username"]
        treatment_name = order_info["treatment"]
        quantity = int(order_info["quantity"])
        
        if username:        
            user = User.query.filter_by(username=func.lower(username)).first()
        else:
            user = User.query.get_or_404(session.get('user_id'))    
            userame=user.username
        print("username",username)
        # lookup Treatment
        treatment = Treatment.query.filter(func.lower(Treatment.name).contains(treatment_name.lower())).first()
        if not treatment:
            return f"❌ Sorry, we don’t have {treatment_name} on the menu."
        print("treatment:", treatment)
      # Connect DB
        conn = sqlite3.connect("instance/treatment_shop.db")
        cursor = conn.cursor()

        total_price = treatment.price * quantity
        cursor.execute("""
            INSERT INTO "order" (user_id, treatment_id, quantity, total_price, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (user.id, treatment.id, quantity, total_price, datetime.utcnow()))
        conn.commit()
        # confirmation from LLM
        confirm_prompt = f"""
        A user has successfully placed a treatment order.

        - User: {username}
        - Treatment: {treatment_name}
        - Quantity: {quantity}
        - Unit Price: {treatment.price}
        - Total Price: {total_price}

        Respond to the user in a friendly way confirming their order.
        """
        return openai_chat(confirm_prompt, api_key)

    except Exception as e:
        return f"❌ Error placing order: {e}"

    finally:
        if conn:
            conn.close()
