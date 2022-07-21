import { API_URL, APPLICATION_URLS } from "./components/common/constants";

class ApiClient {
  async secureFetch(url, init) {
    const response = await fetch(this.buildUrl(url), init);
    if (!response.ok) {
      if (response.headers.get("content-type") === "application/json") {
        const result = await response.json();
        if (result.detail) {
          if (typeof result.detail === "string") {
            throw new Error(result.detail);
          } else {
            let errorMessage = result.detail
              .map((el) => `${el.loc.join(":")} - ${el.msg}`)
              .join("\n;");
            throw new Error(errorMessage);
          }
        }
      }
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  buildUrl(url) {
    return `${API_URL.substr(-1) === "/" ? API_URL.substr(0, -1) : API_URL}${url}`;
  }

  async register(firstName, lastName, email, password, setRegistered, setError) {
    const userInfo = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    };
    await this.secureFetch(APPLICATION_URLS.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then((resp) => {
        setRegistered(true);
        return resp.json();
      })
      .catch((error) => {
        console.log(`Error during registration: ${error}`);
        setRegistered(false);
        setError(error.message);
      });
  }

  async login(username, password) {
    const loginInfo = {
      username: username,
      password: password,
    };

    let formBody = [];
    for (const property in loginInfo) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(loginInfo[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    const response = await this.secureFetch(APPLICATION_URLS.getToken, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    })
      .then((resp) => {
        return resp.json();
      })
      .catch((error) => {
        return { error: error };
      });

    return response;
  }
}

export const api = new ApiClient();
