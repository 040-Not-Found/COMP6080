export default class Api {
  constructor () {
    this.url = 'http://localhost:5005';
    this.playerId = '';
    this.options = {
      method: '',
      headers: {
        Accept: 'application/json',
        Authorization: '',
        'Content-Type': 'application/json',
      },
    };
  }

  // set api method
  setMethod (method) {
    this.options.method = method;
  }

  // set api option
  setBody (body) {
    this.options.body = body;
  }

  // sets the Api auth token
  setAuth () {
    this.options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  // return data.json
  async apiCall (path) {
    return await fetch(`${this.url}${path}`, this.options)
      .then((res) => res.json());
  }

  login (body) {
    this.setMethod('POST')
    this.setBody(body);
    return this.apiCall('/admin/auth/login')
  }

  register (body) {
    this.setMethod('POST')
    this.setBody(body);
    return this.apiCall('/admin/auth/register')
  }

  logout () {
    this.setMethod('POST');
    this.setAuth();
    return this.apiCall('/admin/auth/logout');
  }

  getQuizzes () {
    this.setMethod('GET');
    this.setAuth();
    delete this.options.body;
    return this.apiCall('/admin/quiz');
  }

  getQuestions (id) {
    this.setMethod('GET');
    this.setAuth();
    delete this.options.body;
    return this.apiCall(`/admin/quiz/${id}`);
  }

  createGame (body) {
    this.setMethod('POST');
    this.setBody(body);
    this.setAuth();
    return this.apiCall('/admin/quiz/new');
  }

  deleteGame (id) {
    this.setMethod('DELETE');
    this.setAuth();
    return this.apiCall(`/admin/quiz/${id}`);
  }

  updateGame (id, body) {
    this.setMethod('PUT');
    this.setBody(body);
    this.setAuth();
    return this.apiCall(`/admin/quiz/${id}`);
  }

  startGame (id) {
    this.setMethod('POST');
    this.setAuth();
    return this.apiCall(`/admin/quiz/${id}/start`);
  }

  endGame (id) {
    this.setMethod('POST');
    this.setAuth();
    return this.apiCall(`/admin/quiz/${id}/end`);
  }

  getSession (id) {
    this.setMethod('GET');
    this.setAuth();
    return this.apiCall(`/admin/session/${id}/status`);
  }

  join (id, body) {
    this.setMethod('POST');
    this.setBody(body);
    this.setAuth();
    return this.apiCall(`/play/join/${id}`)
  }
}
