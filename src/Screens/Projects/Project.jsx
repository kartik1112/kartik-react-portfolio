import React, { useEffect, useState } from 'react'
import { Octokit } from 'octokit'
import githubToken from '../../../public/secrets'
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import './Project.css'
import axios from 'axios';
import { Link } from 'react-router-dom';

const Project = () => {

    // const axios = new Axios()
    // axios.headers()
    const octokit = new Octokit({
        auth: githubToken
    })
    const [tempArr, setTempArr] = useState([]);
    const [imageAddress, setImageAddress] = useState([]);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [username, setUserName] = useState('');
    const [githubProfileLink, setGithubProfileLink] = useState('');

    const getImage = async () => {
        const config = {
            method: "get",
            url: "https://api.unsplash.com/search/photos?page=1&query=Buildings&client_id=wQw_CuIPNAiy90LjR04lkIR7VMJE6Mj3nSGYGvlD0wY",
            headers: {
                accessKey: "wQw_CuIPNAiy90LjR04lkIR7VMJE6Mj3nSGYGvlD0wY"
            }
        }
        axios(config).then((res) => {
            setImageAddress(...res.data.results)
            console.log(imageAddress, "sd")

        })
        // console.log(data.data.results[0].urls.raw)
    }

    useEffect(() => {
        getGitData();
        getImage();
        const letters = "qwertyuiopasdfghjklzxcvbnm";
        let interval = null;

        const h1Element = document.getElementById("cipher");
        let iteration = 0;

        clearInterval(interval);

        interval = setInterval(() => {
            h1Element.innerText = h1Element.innerText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return h1Element.dataset.value[index];
                    }
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");

            if (iteration >= h1Element.dataset.value.length) {
                clearInterval(interval);
            }

            iteration += 1 / 5;
        }, 40);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);


    function getGitData() {
        octokit.request('GET /user/repos/', {
            type: 'public'
        }).then(response => {
            const temp = response.data
            setAvatarUrl(temp[0].owner.avatar_url)
            setUserName(temp[0].owner.login)
            setGithubProfileLink(temp[0].owner.html_url)
            setTempArr(temp)
            console.log(temp, "res");
        })
    }
    // console.log(tempArr);

    function capitalize(s) {
        return s[0].toUpperCase() + s.slice(1);
    }



    return (
        <div>
            <Navbar />
            <div style={{
                margin: "100px 0px 100px 0px",
            }}>
                <div className='project-header'>
                    <h1 data-value='Projects' id='cipher'>Projects</h1>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        height: "50px",
                    }}>
                        <Link to={githubProfileLink}><p>{"/" + username}</p></Link>
                        <img height={50} style={{ borderRadius: "50vh", marginLeft: '10px' }} src={avatarUrl} alt="loading" />
                    </div>
                </div>

                <div className='project-container'>
                    {
                        tempArr.map((item, index) => {
                            return (
                                <a href={item.html_url} style={{ textDecoration: 'none' }} key={index}>
                                    <div className='project-element' >
                                        <img width='50%' style={{
                                            margin: '20% 0% 20% 0%',
                                        }} src="https://images.unsplash.com/photo-1546146830-2cca9512c68e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                        <div className='tile-details'>
                                            <p>
                                                {capitalize(item.name.toString().replaceAll("-", " ").slice(0, 30))}
                                            </p>
                                            <Link to={item.html_url}><img style={{
                                            }} width='45px' src="public/assets/git-logo.svg" alt="" /></Link>
                                        </div>
                                        {/* <img src={imageAddress[index].urls.raw} alt="dfgf" /> */}
                                    </div>
                                </a>
                            )
                        })
                    }
                </div>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Project
