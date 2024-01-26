import { useRoutes } from "react-router-dom";
import { Game } from '../Game'
import { MainLayout } from "../Views/Layouts/MainLayout";
import { CreateRoom } from "../Views/Rooms/CreateRoom";

export const Router = () => {
    const element = useRoutes([
        {
            element: <MainLayout />,
            children: [
                {
                    path: "/",
                    element: null,
                },
                {
                    path: "create-room",
                    element: <CreateRoom />,
                },
                {
                    path: "join-room",
                    element: null,
                },
            ]
        },
        {
            path: "/play",
            element: <Game />
        }
    ]);
    return element;
};

