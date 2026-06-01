import json
import sqlite3

from application.llm_chat import (
    completion_followup,
    completion_with_tools,
    format_tool_error,
)
from application.provider_config import lab_cloud_llm_model_default

def get_treatment_price(treatment_type):
    """
    VULNERABLE: Get the price for a specific treatment type using raw SQL query
    This function is intentionally vulnerable to SQL injection attacks
    """
    conn = None
    try:
        # Connect to the database (assuming SQLite for this demo)
        conn = sqlite3.connect('instance/treatment_shop.db')
        cursor = conn.cursor()
        print("DEBUG: Connected to database")
        
        # Test database connection by listing all treatments
        cursor.execute("SELECT name, price FROM treatment")
        all_treatments = cursor.fetchall()
        print(f"DEBUG: All treatments in database: {all_treatments}")
        # VULNERABLE: Direct string concatenation in SQL query
        # This allows SQL injection through the treatment_type parameter
        treatment = treatment_type.lower().replace("treatment", "").strip()
        
        # DANGEROUS: Building SQL query with user input without parameterization
        query = f"SELECT name, price FROM treatment WHERE LOWER(name) LIKE '%{treatment}%'"
        
        print(f"DEBUG: Executing SQL query: {query}")  # For demonstration purposes
        
        cursor.execute(query)
        result = cursor.fetchone()
        
        print(f"DEBUG: Query result: {result}")  # Debug output
        
        if result:
            _, price = result  # We only need the price, but must unpack both values
            result_msg = f"${price}"
            print(f"DEBUG: Returning price: {result_msg}")
            return result_msg
        else:
            print("DEBUG: No treatment found")
            return "Treatment not found in our menu"
            
    except sqlite3.Error as e:
        # Return database error - this can leak sensitive information
        return f"Database error: {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"
    finally:
        if conn:
            conn.close()

# Function definition for OpenAI
price_function = {
    "name": "get_treatment_price",
    "description": "Get the price for a specific treatment type.",
    "parameters": {
        "type": "object",
        "properties": {
            "treatment_type": {
                "type": "string",
                "description": "The type of treatment you want to know the price for"
            },
        },
        "required": ["treatment_type"],
    },
}

def chat_with_openai(user_input, api_key):
    
    try:
        response = completion_with_tools(
            [
                {"role": "system", "content": "You are a helpful treatment shop assistant that can provide prices for different treatment types. "},
                {"role": "user", "content": user_input},
            ],
            api_key=api_key,
            tools=[{
                "type": "function",
                "function": price_function
            }],
            tool_choice="auto",
            model=lab_cloud_llm_model_default(),
        )
        
        # Check if the model wants to call a function
        message = response.choices[0].message
        
        if hasattr(message, 'tool_calls') and message.tool_calls:
            for tool_call in message.tool_calls:
                if tool_call.type == "function" and tool_call.function.name == "get_treatment_price":
                    # Parse the function arguments
                    arguments = json.loads(tool_call.function.arguments)
                    treatment_type = arguments.get('treatment_type')
                    
                    if treatment_type:
                        # VULNERABLE: No validation before executing function
                        print(f"DEBUG: Calling get_treatment_price with: {treatment_type}")
                        price = get_treatment_price(treatment_type)
                        print(f"DEBUG: get_treatment_price returned: {price}")
                        
                        # Get a response that includes the function result
                        second_response = completion_followup(
                            [
                                {"role": "system", "content": "You are a helpful treatment shop assistant that can provide prices for different treatment types."},
                                {"role": "user", "content": user_input},
                                {"role": "assistant", "content": None, "tool_calls": [
                                    {
                                        "id": tool_call.id,
                                        "type": "function",
                                        "function": {
                                            "name": "get_treatment_price",
                                            "arguments": tool_call.function.arguments
                                        }
                                    }
                                ]},
                                {"role": "tool", "tool_call_id": tool_call.id, "content": f"The price for {treatment_type} treatment is {price}"}
                            ],
                            api_key=api_key,
                            model=lab_cloud_llm_model_default(),
                        )
                        print(f"DEBUG: Tool call content sent to model: 'The price for {treatment_type} treatment is {price}'")
                        final_response = second_response.choices[0].message.content
                        print(f"DEBUG: Final model response: {final_response}")
                        return final_response
        
        # Return the original response if no function was called
        return message.content
    
    except Exception as e:
        return format_tool_error(e)
