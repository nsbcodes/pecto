import React from 'react'
import ReactDOM from 'react-dom/client'
import Pack from './Pack/Pack'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './Root' // Name conflict with Bootstrap
import './index.scss'
import { NewPack } from './Pack/NewPack'
import { UserView } from './UserView'
import { SearchPacks } from './SearchPacks'
import Home from './Home'
import EditPack from './Pack/EditPack'
import { Blitz } from './Pack/Experiences/Blitz/Blitz'
import { Comprehend } from './Pack/Experiences/Comprehend/Comprehend'
import { Extrapolate } from './Pack/Experiences/Extrapolate/Extrapolate'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: 'view/:displayName',
				element: <UserView />,
			},
			{
				path: 'view/me',
				element: <Home />,
			},
			{
				path: 'view/:displayName/:packId',
				element: <Pack />,
			},
			{
				path: 'edit/:displayName/:packId',
				element: <EditPack />,
			},
			{
				path: 'blitz/:displayName/:packId',
				element: <Blitz />,
			},
			{
				path: 'comprehend/:displayName/:packId',
				element: <Comprehend />,
			},
			{
				path: 'extrapolate/:displayName/:packId',
				element: <Extrapolate />,
			},
			{
				path: 'new/pack',
				element: <NewPack />,
			},
			{
				path: 'search/:searchTerm',
				element: <SearchPacks />,
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)

// var script = document.createElement('script')
// script.src = '//cdn.jsdelivr.net/npm/eruda'
// document.body.appendChild(script)
// script.onload = function () {
// 	eruda.init()
// }
