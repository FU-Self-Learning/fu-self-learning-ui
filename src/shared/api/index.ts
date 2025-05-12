import axios, { AxiosInstance } from "axios";
export class Api {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }
}

const api = new Api().instance;
export default api;
