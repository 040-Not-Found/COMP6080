import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Api from '../Api';
import SignUp from './SignUp';

const email = 'celinelin@unsw.com'
const password = 'password'
const name = 'Celine'

jest.mock('../Api');
beforeAll(() => {
  window.alert = jest.fn();
});
afterEach(() => {
  jest.resetAllMocks();
});

test('inputs of email, password, name and a sign in button exist', () => {
  render(
    <BrowserRouter>
      <SignUp/>
    </BrowserRouter>
  )

  const headerElement = screen.getByText('Sign Up');
  const emailField = screen.getByLabelText('Email');
  const passwordField = screen.getByLabelText('Password');
  const nameField = screen.getByLabelText('Name');
  const button = screen.getByRole('button', { name: 'Register' });
  expect(headerElement).toBeInTheDocument();
  expect(emailField).toBeInTheDocument();
  expect(passwordField).toBeInTheDocument();
  expect(nameField).toBeInTheDocument();
  expect(button).toBeInTheDocument();
});

test('TextFields update correctly', () => {
  render(
    <BrowserRouter>
      <SignUp/>
    </BrowserRouter>
  )

  const emailField = screen.getByLabelText('Email');
  const passwordField = screen.getByLabelText('Password');
  const nameField = screen.getByLabelText('Name');

  fireEvent.change(emailField, { target: { value: email } });
  fireEvent.change(passwordField, { target: { value: password } });
  fireEvent.change(nameField, { target: { value: name } });

  expect(emailField).toHaveValue(email);
  expect(passwordField).toHaveValue(password);
  expect(nameField).toHaveValue(name);
});

test('registered success', async () => {
  const success = jest.fn();
  const api = new Api();
  api.register = jest.fn().mockImplementation(() => Promise.resolve({ token: 'token' }));
  Api.mockImplementation(() => api);
  const { getByLabelText, getByRole } = render(
    <BrowserRouter>
      <SignUp onSuccess={success} />
    </BrowserRouter>
  );
  const emailField = getByLabelText('Email');
  const passwordField = getByLabelText('Password');
  const nameField = getByLabelText('Name');
  const button = getByRole('button', { name: 'Register' });

  await act(async () => {
    fireEvent.change(emailField, { target: { value: email } });
    fireEvent.change(passwordField, { target: { value: password } });
    fireEvent.change(nameField, { target: { value: name } });
    fireEvent.click(button);
  });

  expect(api.register).toHaveBeenCalled();
  expect(success).toHaveBeenCalledWith('token');
});

test('registered failed', async () => {
  const success = jest.fn();
  const api = new Api();
  api.register = jest.fn().mockImplementation(() => Promise.resolve({ error: 'Invalid input' }));

  const { getByRole } = render(
    <BrowserRouter>
      <SignUp onSuccess={success} />
    </BrowserRouter>
  );
  const button = getByRole('button', { name: 'Register' });

  await act(async () => {
    fireEvent.click(button);
  });
  expect(api.register).not.toHaveBeenCalled()
});
