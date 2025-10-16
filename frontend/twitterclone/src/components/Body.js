import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import Explore from './Explore';
import Grok from './Grok';
import Messages from './Messages';
import Bookmarks from './Bookmarks';
import Communities from './Communities';
import Feed from './Feed';
import Profile from './Profile';

const Body = () => {
    const appRouter = createBrowserRouter([
        {
            path: "/",
            element: <Home/>,
            children:[
                {
                    path:"/",
                    element:<Feed/>
                },
                {
                    path:"/explore",
                    element:<Explore/>
                },
                {
                    path:"/grok",
                    element:<Grok/>
                },
                {
                    path:"/messages",
                    element:<Messages/>
                },
                {
                    path:"/bookmarks",
                    element:<Bookmarks/>
                },
                {
                    path:"/communities",
                    element:<Communities/>
                },
                {
                    path:"/profile/:id",
                    element:<Profile/>
                }
            ]
        },
        {
            path: "/login",
            element: <Login />
        }
    ])
    return (
        <div>
            <RouterProvider router={appRouter} />
        </div>
    )
}

export default Body