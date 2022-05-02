import { useEffect, useState } from 'react';
import '../css/activity.css';
import redline from '../img/red-line.png';
import stockImg from '../img/filter-hero.png';

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min); // Funktion der genererer et tal mellem to satte værdier
}

const activityIDs = {
	museum: [6, 10, 12, 13],
	parks: [5, 7, 14, 18, 50],
	architect: [4, 8, 15, 16],
	eatery: [63, 64, 65],
	nightlife: [107],
};

export default function Result(props) {
	const [result, setResult] = useState({}); // Final result
	const [userData, setUserData] = useState({}); // User data
	const [userCategories, setUserCategories] = useState([]);
	const [activityData, setActivityData] = useState(null);

	useEffect(() => {
		const data = localStorage.getItem('userData');
		setUserData(JSON.parse(data));
	}, []);

	useEffect(() => {
		async function getData() {
			const res = await fetch('data/data.json');
			const data = await res.json();
			setActivityData(data);
		}
		getData();
	}, []);

	useEffect(() => {
		let selectedCategories = userData.categories;
		if (selectedCategories) {
			let modCategory = '';
			for (let i = 0; i < selectedCategories.length; i++) {
				if (selectedCategories[i] === true) {
					switch (i) {
						case 0:
							modCategory += activityIDs.museum;
							break;
						case 1:
							modCategory += activityIDs.parks;
							break;
						case 2:
							modCategory += activityIDs.architect;
							break;
						case 3:
							modCategory += activityIDs.eatery;
							break;
						case 4:
							modCategory += activityIDs.nightlife;
							break;
						default:
							break;
					}
					if (modCategory[modCategory.length - 1] !== ',') {
						modCategory += ',';
					}
				}
			}
			if (modCategory[modCategory.length - 1] === ',') {
				modCategory = modCategory.slice(0, -1);
			}
			modCategory = modCategory.split(',');
			let toInt = [];
			for (let i = 0; i < modCategory.length; i++) {
				toInt.push(parseInt(modCategory[i]));
			}
			setUserCategories(toInt);
		}
	}, [userData]);

	useEffect(() => {
		if (activityData != null) {
			let sortedArray = [];
			let randomInt = null;
			let data = null;
			for (const activity of activityData) {
				let n = activity.Category.Id;
				if (userCategories.includes(n)) {
					sortedArray.push(activity);
				}
			}
			randomInt = getRandomInt(0, sortedArray.length);
			const i = sortedArray[randomInt];
			data = {
				name: i.Name,
				img: i.Files[0],
				category: i.Category.Name,
				description: i.Descriptions[0].Text,
				address: i.Address.AddressLine1,
				city: i.Address.PostalCode + ' ' + i.Address.City,
			};
			setResult(data);
		}
	}, [activityData]);

	function refreshPage() {
		window.location.reload(false);
	}

	// console.log(userData, activityData, userCategories)
	return (
		<>
			<section
				className='hero'
				style={{
					backgroundImage: `url(${result.img ? result.img.Uri : stockImg})`,
				}}
			>
				<div className='border-color'></div>
			</section>
			<div className='info-box'>
				<div className='top'>
					<h1>{result.name}</h1>
					<a href='#'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
							<path d='M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z' />
						</svg>
					</a>
				</div>
				<h2>{result.category}</h2>
				<div className='red-line'>
					<img src={redline} alt='red line divider' />
				</div>

				<p>{result.description}</p>

				<div className='address'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'>
						<path d='M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z' />
					</svg>
					<p>{result.address + ', ' + result.city}</p>
				</div>

				<div class='action-buttons'>
					<button class='shuffle' onClick={refreshPage}>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
							<path d='M424.1 287c-15.13-15.12-40.1-4.426-40.1 16.97V352H336L153.6 108.8C147.6 100.8 138.1 96 128 96H32C14.31 96 0 110.3 0 128s14.31 32 32 32h80l182.4 243.2C300.4 411.3 309.9 416 320 416h63.97v47.94c0 21.39 25.86 32.12 40.99 17l79.1-79.98c9.387-9.387 9.387-24.59 0-33.97L424.1 287zM336 160h47.97v48.03c0 21.39 25.87 32.09 40.1 16.97l79.1-79.98c9.387-9.391 9.385-24.59-.0013-33.97l-79.1-79.98c-15.13-15.12-40.99-4.391-40.99 17V96H320c-10.06 0-19.56 4.75-25.59 12.81L254 162.7L293.1 216L336 160zM112 352H32c-17.69 0-32 14.31-32 32s14.31 32 32 32h96c10.06 0 19.56-4.75 25.59-12.81l40.4-53.87L154 296L112 352z' />
						</svg>
					</button>
					<button class='go'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'>
							<path d='M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z' />
						</svg>
					</button>
				</div>
			</div>
		</>
	);
}
