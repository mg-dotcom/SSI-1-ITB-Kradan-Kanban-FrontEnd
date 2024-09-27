class CookieUtil {
  static get(name) {
    const cookieName = `${encodeURIComponent(name)}=`;
    const cookieStart = document.cookie.indexOf(cookieName);
    let cookieValue = null;

    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(";", cookieStart);
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(
        document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
      );
    }
    return cookieValue;
  }

  static set(name, value, expires, path = "/") {
    let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expires instanceof Date) {
      cookieText += `;expires=${expires.toUTCString()}`;
    }

    if (path) {
      cookieText += `;path=${path}`;
    }

    document.cookie = cookieText;
  }

  static unset(name, path = "/") {
    // Setting the cookie value to an empty string and the expiration date to the past
    CookieUtil.set(name, "", new Date(0), path);
  }
}

export { CookieUtil };
