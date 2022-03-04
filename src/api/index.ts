import express from 'express';
import cors from 'cors';
import { authMiddleware } from '../middlewares/authMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { databaseMiddleware } from '../middlewares/databaseMiddleware';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { createRateLimiter } from './apiRateLimiter';
import { languageMiddleware } from '../middlewares/languageMiddleware';
import { clienteMiddleware } from '../middlewares/clienteMiddleware';
const scheduleRoutes = require('../api/notificacao/appNotificacaoCliente');
const scheduleRoutes3 = require('../api/cursoCliente/appRotinaBoleto');

const app = express();

// Enables CORS
app.use(cors({ origin: true }));

// Initializes and adds the database middleware.
app.use(databaseMiddleware);

// Sets the current language of the request
app.use(languageMiddleware);

// Configures the authentication middleware
// to set the currentUser to the requests
app.use(authMiddleware);

// Middleware para validar id/token de um Cliente usando o App
app.use('/api/app/cliente/:id/:token', clienteMiddleware);

// Default rate limiter
const defaultRateLimiter = createRateLimiter({
  max: 500,
  windowMs: 15 * 60 * 1000,
  message: 'errors.429',
});
app.use(defaultRateLimiter);

// Enables Helmet, a set of tools to
// increase security.
app.use(helmet());

// Parses the body of POST/PUT request
// to JSON
app.use(
  bodyParser.json({
    limit: '50mb', 
    // extended: true, 
    verify: function (req, res, buf) {
      const url = (<any>req).originalUrl;
      if (url.startsWith('/api/plan/stripe/webhook')) {
        // Stripe Webhook needs the body raw in order
        // to validate the request
        (<any>req).rawBody = buf.toString();
      }
    },
  }),
);

// Configure the Entity routes
const routes = express.Router();

require('./auditLog').default(routes);
require('./auth').default(routes);
require('./plan').default(routes);
require('./tenant').default(routes);
require('./file').default(routes);
require('./user').default(routes);
require('./settings').default(routes);
require('./cliente').default(routes);
require('./notificacao').default(routes);
require('./notificacaoCliente').default(routes);
require('./curso').default(routes);
require('./cursoModulo').default(routes);
require('./cursoAula').default(routes);
require('./cursoCliente').default(routes);
require('./cursoClienteAula').default(routes);
require('./smtp').default(routes);
require('./plano').default(routes);
require('./planoCliente').default(routes);
// Loads the Tenant if the :tenantId param is passed
routes.param('tenantId', tenantMiddleware);

// Add the routes to the /api endpoint
app.use('/api', routes);

app.use("/schedule", scheduleRoutes);
app.use("/schedule", scheduleRoutes3);

export default app;
