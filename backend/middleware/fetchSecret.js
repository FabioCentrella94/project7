// PRODUCTION ENVIRONMENT
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

async function fetchSecret() {
  const secret_name = "prod/project7-backend/jwt-secret-key";

  const client = new SecretsManagerClient({
    region: "eu-west-2",
  });

  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT",
      })
    );
  } catch (error) {
    throw error;
  }

  const secret = response.SecretString;

  return secret;
}

module.exports.fetchSecret = fetchSecret;
