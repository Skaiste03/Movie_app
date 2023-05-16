const API_URI = 'http://localhost:5000/api/movies';
class API {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getAllData() {
    const response = await fetch(this.endpoint);
    const data = response.json();

    return data;
  }

  async getLimitedData(page) {
    const response = await fetch(`${this.endpoint}/${page}`);
    const data = response.json();

    return data;
  }

  async sendData(payload) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return data;
  }

  async updateData(id, payload) {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return data;
  }

  async deleteData(id) {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    return data;
  }
}

const api = new API(API_URI);

export default api;
