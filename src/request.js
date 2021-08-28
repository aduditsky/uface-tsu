const get = async (api) => {
  const f = await fetch('https://uface.su/' + api);
  const json = await f.json();
  return json;
};

const getAuth = async (api) => {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  const f = await fetch('https://uface.su/' + api, requestOptions);
  const json = await f.json();
  return json;
};

const deletePhoto = async (api) => {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  var urlencoded = new URLSearchParams();

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };

  const f = await fetch('https://uface.su/' + api, requestOptions);
  const json = await f.json();
  return json;
};

const MakeExtImgAsMain = async (api) => {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    redirect: 'follow',
  };

  const f = await fetch('https://uface.su/' + api, requestOptions);
  const json = await f.json();
  return json;
};

const post = async (api, data, formElem) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  var urlencoded = new URLSearchParams();
  for (let i = 0; i < data.length; i++) {
    urlencoded.append(data[i][0], data[i][1]);
  }

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    // body: new FormData({formElem}),
    redirect: 'follow',
  };
  const f = await fetch('https://uface.su/' + api, requestOptions);
  const json = await f.json();
  return json;
};

const postAuth = async (api, data) => {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  var urlencoded = new URLSearchParams();
  for (let i = 0; i < data.length; i++) {
    urlencoded.append(data[i][0], data[i][1]);
  }

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };
  const f = await fetch('https://uface.su/' + api, requestOptions);
  const json = await f.json();
  return json;
};

const postToken = async (api) => {
  var myHeaders = new Headers();
  myHeaders.append('Refresh_t', localStorage.getItem('rtoken'));
  myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

  var urlencoded = new URLSearchParams();

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };
  const f = await fetch('https://uface.su/' + api, requestOptions);
  const json = await f.json();
  return json;
};

export default {
  get,
  post,
  postAuth,
  deletePhoto,
  getAuth,
  postToken,
  MakeExtImgAsMain,
};
