import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./src/Routes";
import "./src/assets/scss/index.scss";
import store from "./src/redux/store";

ReactDOM.createRoot(document.getElementById("root")).render(
	// <React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>

);
