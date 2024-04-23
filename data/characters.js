//import axios, md5
import axios from "axios";
import md5 from 'blueimp-md5' //you will need to install this module;



export const searchCharacterByName = async (name) => {
  //Function to search the api and return up to 15 characters matching the name param

  if (name == undefined || name.trim() == '') {
    throw [400, "Please enter a character name."]
  }
  const publickey = 'a3da5c9141045926da3eab867d14cb23';
  const privatekey = '5aca6af241ca0d5e859b13699fc7010690b86ed7';
  const ts = new Date().getTime();
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
  const url = baseUrl + '?nameStartsWith=' + name + '&limit=15' +'&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
  const characters = await axios.get(url).catch(function (error) {
    if (error.response) {
      throw [error.response.data.code, error.response.data.status];
    }
  });
  // if (characters.data.code != 200) {
  //   throw [characters.data.code, characters.data.status]
  // }
  // if (characters.data.count == 0) {
  //   return [];
  // }
  // else{
  return characters.data.data.results;
  // }
 
};

export const searchCharacterById = async (id) => {
  //Function to fetch a character from the api matching the id
  const publickey = 'a3da5c9141045926da3eab867d14cb23';
  const privatekey = '5aca6af241ca0d5e859b13699fc7010690b86ed7';
  const ts = new Date().getTime();
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
  
  const url = baseUrl + '/' + id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
  
  const character = await axios.get(url).catch(function (error) {
    if (error.response) {
      throw [error.response.data.code, error.response.data.status];
    }
  });
  // if (character.data.code != 200) {
  //   throw [character.data.code, character.data.status]
  // }
  // else{
  return character.data.data.results[0];
  // }
};
