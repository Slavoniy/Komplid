from fastapi.testclient import TestClient
from tests.conftest import client

def get_auth_token():
    # Register user
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "first_name": "Test",
        "last_name": "User",
        "company_name": "Test Company"
    }
    # ignore errors if already exists
    client.post("/api/auth/register", json=user_data)

    # Login
    response = client.post(
        "/api/auth/token",
        data={"username": "test@example.com", "password": "testpassword123"}
    )
    return response.json()["access_token"]

def test_create_company():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    company_data = {
        "name": "New Construction Co",
        "inn": "1234567890",
        "ogrn": "1234567890123",
        "sro_build": "SRO-123",
        "sro_project": "SRO-456"
    }

    response = client.post("/api/companies/", json=company_data, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "New Construction Co"
    assert "id" in data

    return data["id"]

def test_get_companies():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/companies/", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_create_project():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Create a company first to be the general contractor
    company_data = {
        "name": "Contractor Co"
    }
    company_response = client.post("/api/companies/", json=company_data, headers=headers)
    contractor_id = company_response.json()["id"]

    project_data = {
        "name": "Big Build 2024",
        "address": "123 Main St",
        "company_id": contractor_id, # for simplicity, making contractor also the owner
        "general_contractor_id": contractor_id
    }

    response = client.post("/api/projects/", json=project_data, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Big Build 2024"
    assert "id" in data

    return data["id"]

def test_get_roles():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/roles/", headers=headers)
    assert response.status_code == 200
    roles = response.json()
    assert len(roles) >= 5 # 5 default roles
    assert any(role["name"] == "Администратор системы" for role in roles)
