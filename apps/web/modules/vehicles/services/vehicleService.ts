const API_URL = "http://localhost:5000/api/v1/vehicles";

class VehicleService {
  async getAll() {
    const res = await fetch(API_URL, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch vehicles");
    }

    const data = await res.json();
    return data.data;
  }

  async getById(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Vehicle not found");
    }

    const data = await res.json();
    return data.data;
  }

  async create(vehicle: any) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(vehicle),
    });

    if (!res.ok) {
      throw new Error("Failed to create vehicle");
    }

    const data = await res.json();
    return data.data;
  }

  async update(id: string, vehicle: any) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(vehicle),
    });

    if (!res.ok) {
      throw new Error("Failed to update vehicle");
    }

    const data = await res.json();
    return data.data;
  }

  async delete(id: string) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to delete vehicle");
    }

    return await res.json();
  }
}

export const vehicleService = new VehicleService();
export default vehicleService;