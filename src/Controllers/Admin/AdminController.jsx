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


export const rejectDepostRequest = async (id, reason) => {
    try {
        const response = await axios.post(`${API.url}/admin/decline-deposit-request`,{  id, reason });
        return response.data
    } catch (error) {
        throw error
    }
}