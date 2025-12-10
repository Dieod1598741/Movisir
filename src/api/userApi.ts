// [용도] API 요청 함수 정의
// [사용법] import { getUsers } from "./userApi";

import axiosInstance from "./axiosInstance";
import type { User } from "./userApi.type";

// 전체 유저 가져오기 (GET)
export const getUsers = () => {
    return axiosInstance.get("/users");
};

// 특정 유저 가져오기 (GET)
export const getUser = (id: User['id']) => {
    return axiosInstance.get(`/users/${id}`);
};

// 유저 추가하기 (POST)
export const addUser = (data: User['data']) => {
    return axiosInstance.post("/users", data);
};

// 유저 수정하기 (PUT)
export const updateUser = (id: User['id'], data: User['data']) => {
    return axiosInstance.put(`/users/${id}`, data);
};

// 유저 일부 수정하기 (PATCH)
export const patchUser = (id: User['id'], data: User['data']) => {
    return axiosInstance.patch(`/users/${id}`, data);
};

// 유저 삭제하기 (DELETE)
export const deleteUser = (id: User['id']) => {
    return axiosInstance.delete(`/users/${id}`);
};
