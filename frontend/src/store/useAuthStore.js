import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({

    authUser: null,
    checkingAuth: true,
    loading: false,

    signup: async ({ name, email, password, age, gender, genderPreference }) => {
       try{
         set({loading: true})
        const res = await axiosInstance.post("/auth/signup", {
            name,
            email,
            password,
            age,
            gender,
            genderPreference
         })
         set({authUser: res.data.user})
         toast.success("Account created successfully")
       }catch(e){
          toast.error( e.response.data.message,"something went wrong")
       }finally{
        set({loading: false})
       }
    },

    checkAuth: async () => {
        try{
          const res = await axiosInstance.get("/auth/me")
          console.log(res.data)
        }catch (e){
          console.log(e)
        }
    }



}))