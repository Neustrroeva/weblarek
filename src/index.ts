import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { ShopApi } from './services/shop-api';
import { AppController } from './controllers/app';

const API_ORIGIN = process.env.API_ORIGIN as string;

const root = document.querySelector('main.gallery') as HTMLElement;

const events = new EventEmitter();
const api = new ShopApi(API_ORIGIN);
const app = new AppController(api, events, root);

events.emit('app:init');