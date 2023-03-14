import logoHeaderFoodExplorer from '../../assets/logoHeaderFoodExplorer.svg';
import {FiSearch} from 'react-icons/fi';
import {Input} from '../../components/Input';
import {FiLogOut} from 'react-icons/fi';

import {api} from '../../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import { useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';

import {AiOutlineMenu} from 'react-icons/ai';
import {GiCrossMark} from 'react-icons/gi';

import {Sidebar} from '../Sidebar';

import {Container, Button} from './styles';

export function HeaderAdm({setPlate=()=>{}, plate}) {
    const [search, setSearch] = useState("");
    const [ingredients, setIngredients] = useState([]);

    const navigate = useNavigate();

    const {signOut} = useAuth();

    useEffect(()=>{
        async function fetchIngredients(){
            const response = await api.get(`/ingredients?name=${search}`);
            setIngredients(response.data);
            //quando der certo eu tenho que ver qual nome será melhor nesse ingredients
            //de acordo com oq ele vai armazenar
        }
        fetchIngredients();
    },[search]);

    useEffect(()=>{
        async function fetchPlate(){
            const response = await api.get(`/plates?title=${search}&ingredients=${JSON.stringify(ingredients)}`);
            setPlate(response.data);
        }
        fetchPlate();
      },[ingredients, search, plate]);

    function logOut() {
        navigate("/");
        signOut();
    }

    function turnHomePage(){
        navigate("/");
    }

    async function addPlate(){
        navigate("/AdminAddPlate");
    }

    //===============mobile==============

    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar)
 
    useEffect(()=>{
        const menu = document.querySelector('.menu')
        if(window.innerWidth < 832){
            menu.classList.remove('hidden')
        }else{
            menu.classList.add('hidden')
        }

        if(window.innerWidth > 832){
            setSidebar(false)
        }
    },[window.innerWidth])

    useEffect(()=>{
        const menu = document.querySelector('.menu')

        if(sidebar === true){
            menu.classList.add('formatSidebarMenu')
        }else{
            menu.classList.remove('formatSidebarMenu')
        }
    },[sidebar])

    return(
        <Container>
            <div className="wrapper_button_logo">
                <button onClick={turnHomePage}>
                    <img src={logoHeaderFoodExplorer} alt='logo food Explorer'/>
                </button>
                <span>admin</span>
            </div>

            <div className="wrapper_menu">
                <div className='menu hidden'>
                    {sidebar === true ?
                    <div className='sidebar'>
                        <GiCrossMark onClick={showSidebar}/>
                        <span>Menu</span>
                    </div>
                    :
                    <AiOutlineMenu onClick={showSidebar}/>
                    }
                    {
                        sidebar 
                        && 
                        <Sidebar 
                        active={setSidebar} 
                        setSearch={setSearch}
                        search={search}
                        />
                    }
                </div>
            </div>

            <div className='wrapper_input'>
                <Input
                icon={FiSearch}
                placeholder="Busque por pratos ou ingredientes" 
                onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className='wrapper_favorites_historic'>
                <Link 
                to={'/FavoritesAdmin'}>
                    <h2>Favoritados</h2>
                </Link>

                <Link to='/OrderHistoryAdm'><h2>Histórico de pedidos</h2></Link>
            </div>

            <Button id='buttonAddPlate' onClick={addPlate}>
                <span>Novo prato</span>
            </Button>

            <button onClick={logOut} className="logOut">
                <FiLogOut />
            </button>
        </Container>
    )
}