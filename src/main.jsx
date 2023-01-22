import React from 'react'
import ReactDOM from 'react-dom/client'
import Pack from './Pack/Pack'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './Root' // Name conflict with Bootstrap
import './index.scss'
import { NewPack } from './Pack/NewPack'
import { UserView } from './UserView'
import Home from './Home'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: 'view/:displayName',
                element: <UserView />
            },
            {
                path: 'view/:displayName/:packId',
                element: <Pack />
            },
            {
                path: 'new/pack',
                element: <NewPack/>
            }
        ],
    },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
