import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useEffect, useCallback } from "react";
import {useDispatch} from "react-redux";
import { getMyProfile, getOtherUsers } from "../redux/userSlice";
import useLiveData from "./useLiveData";

const useOtherUsers = (id, enableLiveUpdates = true) => {
    const dispatch = useDispatch();
    
    const fetchOtherUsers = useCallback(async () => {
        try {
            if(!id) return;
            const res = await axios.get(`${USER_API_END_POINT}/otheruser/${id}`,{
                withCredentials:true
            });
            dispatch(getOtherUsers(res.data.otherUsers));
        } catch (error) {
            console.log(error);
        }
    }, [id, dispatch]);

    // Use live data hook for auto-refresh every 30 seconds
    useLiveData(fetchOtherUsers, 30000, [id], enableLiveUpdates && !!id);

    useEffect(()=>{
        fetchOtherUsers();
    },[id, fetchOtherUsers]);
};
export default useOtherUsers;