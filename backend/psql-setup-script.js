const { sequelize } = require('./db/models');

sequelize.showAllSchemas({ logging: false }).then(async (data) => {
  if (!data.includes(process.env.SCHEMA)) {
    await sequelize.createSchema(process.env.SCHEMA);
  }
});

// per alec video:
// allow us to use schema, render only allows us to have single db at a time rather than individual db for each project
// above code allows create 1 db for all of our projects
// partition each db for each indv project
// schema is partition between sections of our db to mimic having multiple db

// npx dotenv sequelize db:migrate
// won't create anything at this point, but sqlite3 tables should have SequelizeMeta now