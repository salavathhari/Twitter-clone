import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useEffect, useCallback } from "react";
import {useDispatch} from "react-redux";
import { getMyProfile } from "../redux/userSlice";
import useLiveData from "./useLiveData";

const useGetProfile = (id, enableLiveUpdates = true) => {
    const dispatch = useDispatch();
    
    const fetchMyProfile = useCallback(async () => {
        try {
            if(!id) return;
            const res = await axios.get(`${USER_API_END_POINT}/profile/${id}`,{
                withCredentials:true
            });
            dispatch(getMyProfile(res.data.user));
        } catch (error) {
            console.log(error);
        }
    }, [id, dispatch]);

    // Use live data hook for auto-refresh every 20 seconds
    useLiveData(fetchMyProfile, 20000, [id], enableLiveUpdates && !!id);

    useEffect(()=>{
        fetchMyProfile();
    },[id, fetchMyProfile]);
};
export default useGetProfile;