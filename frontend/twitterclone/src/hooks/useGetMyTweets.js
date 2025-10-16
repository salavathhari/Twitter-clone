import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../redux/tweetSlice";
import useLiveData from "./useLiveData";

const useGetMyTweets = (id, enableLiveUpdates = true) => {
    const dispatch = useDispatch();
    const { refresh, isActive } = useSelector(store => store.tweet);
    

    const fetchMyTweets = useCallback(async () => {
        try {
            if(!id) return;
            const res = await axios.get(`${TWEET_API_END_POINT}/alltweets/${id}`, {
                withCredentials: true
            });
            dispatch(getAllTweets(res.data.tweets));
        } catch (error) {
            console.log(error);
        }
    }, [id, dispatch]);

    const followingTweetHandler = useCallback(async () => { 
        try {
            if(!id) return;
            const res = await axios.get(`${TWEET_API_END_POINT}/followingtweets/${id}`, { withCredentials: true });
            dispatch(getAllTweets(res.data.tweets));
        } catch (error) {
            console.log(error);
        }
    }, [id, dispatch]);

    const fetchTweets = useCallback(async () => {
        if(isActive){
            await fetchMyTweets();
        }else{
            await followingTweetHandler();
        }
    }, [isActive, fetchMyTweets, followingTweetHandler]);

    // Use live data hook for auto-refresh every 15 seconds
    useLiveData(fetchTweets, 15000, [isActive, refresh, id], enableLiveUpdates && !!id);

    useEffect(() => {
        fetchTweets();
    }, [isActive, refresh, id, fetchTweets]);
};
export default useGetMyTweets;