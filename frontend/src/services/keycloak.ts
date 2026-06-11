import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "whiteboard-realm",
  clientId: "whiteboard-client",
});

let initialized = false;

export async function initKeycloak(): Promise<boolean> {
  if (initialized || keycloak.authenticated) {
    initialized = true;
    return keycloak.authenticated ?? false;
  }

  const authenticated = await keycloak.init({
    onLoad: "check-sso",
    pkceMethod: "S256",
    silentCheckSsoRedirectUri:
      window.location.origin + "/silent-check-sso.html",
  });

  initialized = true;
  return authenticated;
}

export default keycloak;
