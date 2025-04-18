import axios from "axios";
import { API } from "../Api";

export const getAllDepositRequest = async (req, res) => {
    try {
        const response = await axios.post(`${API.url}/admin/all-deposit-requests`);
        return response.data
    } catch (error) {
        return []
    }
}


export const approveDepositRequest = async (id) => {
    try {
        const response = await axios.post(`${API.url}/admin/approve-deposit-request`,{
            id
        });
        return response.data
    } catch (error) {
        throw error
    }
}