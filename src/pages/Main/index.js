import React, {useState, useCallback, useEffect} from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa';
import {Container, Form, SubmitButton, List, DeleteButton} from './styles';

import api from '../../services/api';

export default function Main(){

  const [newRepo, setNewRepo] = useState('');
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  //DidMount - Buscar
  useEffect(()=>{
    const repoStorage = JSON.parse(localStorage.getItem('repos'));
    if(repoStorage){
      setRepositorios(repoStorage);
    }
  }, [])
  
  
  //DidUpdate - Salvar alterações
  useEffect(() => {
    localStorage.setItem('repos', JSON.stringify(repositorios)) 
  }, [repositorios]);


  const handleSubmit = useCallback((e)=>{
    e.preventDefault();

    async function submit(){
      setLoading(true);
      setAlert(null);
      try{

        if(newRepo === ''){
          throw new Error('Você precisa indicar um repositório!')
        }
        const response = await api.get(`repos/${newRepo}`);
  
        const data = {
          name: response.data.full_name,
        }

        const hasRepo = repositorios.find(repo => repo.name === newRepo);
        if(hasRepo){
          throw new Error('Repositório Duplicado')
        }
    
        setRepositorios([...repositorios, data]);
        setNewRepo('');
      }catch(error){
        setAlert(true);
        console.log(error);
      }finally{
        setLoading(false);
      }

    }

    submit();

  }, [newRepo, repositorios]);

  function handleinputChange(e){
    setAlert(null);
    setNewRepo(e.target.value);
  }

  const handleDelete = useCallback((repo) => {
    const find = repositorios.filter(r => r.name !== repo);
    setRepositorios(find);
  }, [repositorios]);

  return(
    <Container>
      
      <h1>
        <FaGithub size={25}/>
        Meus Repositorios
      </h1>

      <Form onSubmit={handleSubmit} error={alert}>
        <input 
        type="text" 
        placeholder="Adicionar Repositorios"
        value={newRepo}
        onChange={handleinputChange}
        />

        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#FFF" size={14}/>
          ) : (
            <FaPlus color="#FFF" size={14}/>
          )}
        </SubmitButton>

      </Form>
      <List>
        {repositorios.map(repo => (
          <li key={repo.name}>
            <span>
              <DeleteButton onClick={() => handleDelete(repo.name)}>
                <FaTrash size={14}/>
              </DeleteButton>
              {repo.name}
            </span>
            <a href="">
              <FaBars size={20}/>
            </a>
          </li>    
        ))}        
      </List>        
    </Container>
  )
}