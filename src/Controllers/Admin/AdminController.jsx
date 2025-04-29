import axios from "axios";
import { API } from "../Api";

export const getAllDepositRequest = async (req, res) => {
  try {
    const response = await axios.post(`${API.url}/admin/all-deposit-requests`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getAllWithdrawalRequests = async (req, res) => {
  try {
    const response = await axios.post(
      `${API.url}/admin/all-withdrawal-request`
    );
    return response.data;
  } catch (error) {
    return [];
  }
};

export const inprocessWithdrawalRequest = async (id) => {
  const response = await axios.post(
    `${API.url}/admin/inprocess-withdrawal-request`,
    { id }
  );
  return response;
};

export const rejectWithdrawalRequest = async (id, reason) => {
  const response = await axios.post(
    `${API.url}/admin/reject-withdrawal-request`,
    { id, reason }
  );
  return response;
};

export const approveWithdrawalRequest = async (id) => {
  const response = await axios.post(
    `${API.url}/admin/approve-withdrawal-request`,
    { id }
  );
  return response;
};

export const approveDepositRequest = async (id) => {
  try {
    const response = await axios.post(
      `${API.url}/admin/approve-deposit-request`,
      {
        id,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectDepostRequest = async (id, reason) => {
  try {
    const response = await axios.post(
      `${API.url}/admin/decline-deposit-request`,
      { id, reason }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
