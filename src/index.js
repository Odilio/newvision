import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import {IntlProvider} from 'react-intl';
import French from './lang/fr.json';
import Portuguese from './lang/pt.json';
import English from './lang/en.json';

const locale = navigator.language;
let lang;
if (locale==="en") {
   lang = English;
} else {
   if (locale === "fr") {
       lang = French;
   } else {
       lang = Portuguese;
   }
}
ReactDOM.render(
  <Router>
    <IntlProvider locale ={locale} messages={French}>
      <App />
    </IntlProvider>,
  </Router>,
  document.getElementById("root")
);

registerServiceWorker();
