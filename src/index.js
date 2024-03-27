const express = require('express');
const sequelize = require('./config/database');
const morgan = require('./config/morgan');

const env = require('dotenv');
const cors = require("cors");

const app = express();
const routes = require('./routes/v1/index.js');
const passport = require('passport');
const { jwtStrategy } = require("./config/passport");

const port = process.env.PORT;

env.config();

app.use(morgan.errorHandler)
app.use(morgan.errorHandler)

app.use(cors())
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use(express.json());
app.use('/api', routes);


// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));


(async () => {

  try {
    await sequelize.sync({
      // force:true
      // alert:true
    });
    console.log('✅ Database synced. ✅');
    app.listen(port, () => {
      console.log(`✅Server listening on http://localhost:${port}✅`);
    });
  } catch (error) {
    console.log('❌ Database connection error: ❌ ', error.message);
    process.exit()
  }
})();