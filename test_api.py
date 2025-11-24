#!/usr/bin/env python3
import requests
import json
import time

BASE_URL = "http://localhost:5045/api"

def test_api():
    print("🧪 Testing Real Estate API...")
    
    # Test 1: GET all properties
    print("\n1. Testing GET /api/properties")
    try:
        response = requests.get(f"{BASE_URL}/properties", timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Properties found: {len(data)}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   Connection error: {e}")
    
    # Test 2: GET all users
    print("\n2. Testing GET /api/users")
    try:
        response = requests.get(f"{BASE_URL}/users", timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Users found: {len(data)}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   Connection error: {e}")
    
    # Test 3: GET all realtors
    print("\n3. Testing GET /api/realtors")
    try:
        response = requests.get(f"{BASE_URL}/realtors", timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Realtors found: {len(data)}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   Connection error: {e}")
    
    # Test 4: POST new property
    print("\n4. Testing POST /api/properties")
    new_property = {
        "address": "123 Test Street",
        "city": "Test City",
        "state": "TS",
        "zipCode": "12345",
        "price": 250000,
        "bedrooms": 3,
        "bathrooms": 2,
        "squareFeet": 1500,
        "propertyType": "House",
        "status": "Available",
        "realtorId": 1,
        "description": "Test property"
    }
    try:
        response = requests.post(f"{BASE_URL}/properties", 
                               json=new_property, 
                               headers={"Content-Type": "application/json"},
                               timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code in [200, 201]:
            print("   ✅ Property created successfully")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   Connection error: {e}")
    
    # Test 5: Check Swagger endpoint
    print("\n5. Testing Swagger documentation")
    try:
        response = requests.get("http://localhost:5045/swagger/index.html", timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Swagger UI accessible")
        else:
            print("   ❌ Swagger UI not accessible")
    except Exception as e:
        print(f"   Connection error: {e}")

if __name__ == "__main__":
    test_api()