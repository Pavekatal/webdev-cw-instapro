// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
// const personalKey = 'prod'
const personalKey = 'pavekatal'
// const baseHost = 'https://webdev-hw-api.vercel.app'
const baseHost = 'https://wedev-api.sky.pro'
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`

export function getPosts({ token }) {
    return fetch(postsHost, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error('Нет авторизации')
            }

            return response.json()
        })
        .then((data) => {
            return data.posts
        })
}

export function getUserPosts({ token, userId }) {
    return fetch(`${postsHost}/user-posts/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Ошибка при получении постов пользователя')
        }
        return response.json()
    })
}

export function addingPosts({ token, description, imageUrl }) {
    return fetch(postsHost, {
        method: 'POST',
        headers: {
            Authorization: token,
        },
        body: JSON.stringify({ description, imageUrl, forceError: true }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Запрос содержит ошибку')
        }

        return response.json()
    })
}

export function deletePosts({ token, postId }) {
    return fetch(`${postsHost}/${postId}`, {
        method: 'DELETE',
        headers: {
            Authorization: token,
        },
    }).then((response) => {
        if (response.status === 401) {
            throw new Error('В процессе удаления поста произошла ошибка')
        }

        return response.json()
    })
}

export function addingLikesPosts({ token, postId }) {
    return fetch(`${postsHost}/${postId}/like`, {
        method: 'POST',
        headers: {
            Authorization: token,
        },
    }).then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            if (response.status === 401) {
                throw new Error(
                    'Чтобы поставить лайк, необходимо авторизоваться',
                )
            }

            throw new Error(
                'При выполнении операции Поставить лайк произошла ошибка',
            )
        }
    })
}

export function removeLikesPosts({ token, postId }) {
    return fetch(`${postsHost}/${postId}/dislike`, {
        method: 'POST',
        headers: {
            Authorization: token,
        },
    }).then((response) => {
        if (!response.ok) {
            throw new Error(
                'При выполнении операции Убрать лайк произошла ошибка',
            )
        }

        return response.json()
    })
}

export function registerUser({ login, password, name, imageUrl }) {
    return fetch(baseHost + '/api/user', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
            name,
            imageUrl,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Такой пользователь уже существует')
        }
        return response.json()
    })
}

export function loginUser({ login, password }) {
    return fetch(baseHost + '/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Неверный логин или пароль')
        }
        return response.json()
    })
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
    const data = new FormData()
    data.append('file', file)

    return fetch(baseHost + '/api/upload/image', {
        method: 'POST',
        body: data,
    }).then((response) => {
        return response.json()
    })
}
