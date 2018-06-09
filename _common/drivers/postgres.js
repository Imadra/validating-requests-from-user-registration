const { Pool } = require('pg').native

const sleep = async a => new Promise(b => setTimeout(b, a * 1000))

module.exports = {
  async init (CONFIG) {
    const pool = new Pool(CONFIG)

    // TODO !! NEED REWORK
    await pool.query(`
      SET statement_timeout = 0;
      SET lock_timeout = 0;
      SET idle_in_transaction_session_timeout = 0;
      SET client_encoding = 'UTF8';
      SET standard_conforming_strings = on;
      SET check_function_bodies = false;
      SET client_min_messages = warning;
      SET row_security = off;
      SET default_tablespace = '';
      SET default_with_oids = false;
      SET search_path = public, pg_catalog;
    `)

    return pool
  }
}