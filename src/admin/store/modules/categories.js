export default {
    namespaced: true,
    state: {
        data: []
    },
    mutations: {
        SET_CATEGORIES: (state, categories) => (state.data = categories),
        ADD_CATEGORY: (state, category) => state.data.unshift(category),
        DELETE_CATEGORY: (state, categoryToDelete) => {
            state.data = state.data.filter(category => category.id !== categoryToDelete);
        },
        ADD_SKILL: (state, newSkill) => {
            state.data = state.data.map(category => {
                if(category.id === newSkill.category) {
                    category.skills.push(newSkill);
                }

                return category;
            })
        },
        REMOVE_SKILL: (state, skillToRemove) => {
            state.data = state.data.map(category => {
                if(category.id === skillToRemove.category) {
                    category.skills = category.skills.filter(skill => skill.id !== skillToRemove.id)
                }
                return category;
            })
        },
        EDIT_SKILL: (state, skillToEdit) => {
            const findCategory = category => {
                if(category.id === skillToEdit.category) {
                    editSkillInCategory(category);
                }
                return category;
            }
            const editSkillInCategory = category => {
                category.skills = category.skills.map(skill => {
                    return skill.id === skillToEdit.id ? skillToEdit : skill
                });
            }
            state.data = state.data.map(findCategory)
        }
    },
    actions: {
        async create({commit}, title) {
            try {
                const {data} = await this.$axios.post('/categories', {title});
                console.log({data});
                commit("ADD_CATEGORY", data);
            } catch (e) {
                throw new Error("произошла ошибка");
            }
        },
        async fetch({ commit }) {
            try {
                const userID = await this.$axios.get('/user').then(response => {
                   return response.data.user.id;
                });
                const {data} = await this.$axios.get(`/categories/${userID}`);
                commit("SET_CATEGORIES", data);
            } catch (e) {
                console.log(e);
            }
        },
        async edit({commit}, title) {
            try {
                const {data} = await this.$axios.post(`/categories/${title.id}`, title);
            } catch (e) {
                throw new Error("произошла ошибка");
            }
        },
        async delete({commit}, categoryId) {
            try {
                const {data} = await this.$axios.delete(`/categories/${categoryId}`);
                commit("DELETE_CATEGORY", categoryId);
            } catch (e) {
                throw new Error("произошла ошибка");
            }
        }
    }
}
