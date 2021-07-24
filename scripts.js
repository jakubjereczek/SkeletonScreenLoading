
const URL = "https://randomuser.me/api/";
const users = [];
const numberOfUsers = 8;
let loading = true;
let error = false;

const mainElement = document.querySelector("main");

const renderType = {
    PRELOAD: "PRELOAD",
    RENDER: "RENDER"
}


const createElement = (element, textContent, className, arrayChilds) => {
    const myElement = document.createElement(element);

    if (textContent)
        myElement.textContent = textContent;
    if (className)
        myElement.className = className;

    if (arrayChilds && arrayChilds.length)
        arrayChilds.forEach(child => {
            myElement.appendChild(child);
        });

    return myElement;
}


const fetchUsers = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        const results = [];
        fetch(`${URL}?results=${numberOfUsers}`)
            .then(data => data.json()
                .then((data) => {
                    loading = true;

                    data.results.forEach((user) => {
                        results.push(user);
                    })
                })).catch(() => {
                    error = true;
                }).finally(() => {
                    if (error) {
                        reject("An error occured!");
                    }
                    loading = false;
                    resolve(results)
                })
    }, 4000);
})


const createCards = () => {
    fetchUsers()
        .then((users) => {
            console.log(users);
            users.forEach((user, index) => {
                const card = createCard(user, index + 1, renderType.RENDER);
                document.querySelector("main").appendChild(card)
            })
        }).catch((err) => {
            const errorElement = createElement("h2", err, "error", []);
            mainElement.textContent = "";
            mainElement.appendChild(errorElement);
            console.log(err)
        })
}

const createCard = (user, index, type) => {
    console.log(type)
    const cardNumber = createElement("div", `${type === renderType.PRELOAD ? "" : `${index}`}`, "card__number", null);
    const cardTitle = createElement("div", `${type === renderType.PRELOAD ? "" : `${user.name.first} ${user.name.last}`}`, "card__title", null);

    const cardContentUserNameValue = createElement("span", `${type === renderType.PRELOAD ? "" : `${user.login.username}`}`, "", null);
    const cardContentUserName = createElement("p", "username: ", "", [cardContentUserNameValue])

    const cardContentEmailValue = createElement("span", `${type === renderType.PRELOAD ? "" : `${user.email}`}`, "", null);
    const cardContentEmail = createElement("p", "username: ", "", [cardContentEmailValue])

    const cardContentFromValue = createElement("span", `${type === renderType.PRELOAD ? "" : `${user.location.country}, ${user.location.city}`}`, "", null);
    const cardContentFrom = createElement("p", "from: ", "", [cardContentFromValue])

    const cardContentAgeValue = createElement("span", `${type === renderType.PRELOAD ? "" : `${user.dob.age}`}`, "", null);
    const cardContentAge = createElement("p", "age: ", "", [cardContentAgeValue])

    const cardContentPhoneValue = createElement("span", `${type === renderType.PRELOAD ? "" : `${user.phone}`}`, "", null);
    const cardContentPhone = createElement("p", "phone: ", "", [cardContentPhoneValue])

    const cardContentImage = createElement("div", "", `${type === renderType.PRELOAD ? "card__content_picture loading" : `card__content_picture`}`, [])
    if (type === renderType.RENDER) {
        (cardContentImage.style.backgroundImage = `url('${user.picture.medium}')`);
    }

    const cardContent = createElement("div", "", "card__content", [cardNumber, cardTitle, cardContentUserName, cardContentEmail, cardContentFrom, cardContentAge, cardContentPhone, cardContentImage]);

    let card = null;
    switch (type) {
        case renderType.RENDER:
            card = document.querySelector(`.card.id-${index}`);
            card.textContent = "";
            card.appendChild(cardContent);
            break;
        case renderType.PRELOAD:
            card = createElement("div", "", `card id-${index + 1}`, [cardContent]);
            break;
    }
    return card;
}

(function init() {
    for (let i = 0; i < numberOfUsers; i++) {
        const emptyCard = createCard(null, i, renderType.PRELOAD);
        mainElement.appendChild(emptyCard)
    }
    createCards();

}())



