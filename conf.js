import { env_identity, env_token }  from './utils';

export const options = {
  options:
    { debug: true },
  connection: {
    cluster: 'aws',
    reconnect: true
  },
  identity: {
    username: env_identity.username,
    password: env_identity.password
  },
  channels: []
};

export const token = env_token;
