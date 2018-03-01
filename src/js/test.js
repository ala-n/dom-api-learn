(function () {
    const template =
        `<div class="questions-list">
                {{#questions}}
                <fieldset class="box-white question-item" data-question-id="{{id}}">
                    <legend>{{text}}</legend>
                    {{#answers}}
                    <div class="question-answer">
                        <input id="id-answer-{{index}}" type="{{type}}" name="{{id}}" value="{{value}}"/>
                        <label for="id-answer-{{index}}">{{value}}</label>
                    </div>
                    {{/answers}}
                </fieldset>
                {{/questions}}
                <div class="dlg-toolbar">
                    <button type="submit">Проверить</button>
                    <button type="button" onclick="endTest()">Закрыть</button>      
                </div>    
         </div>`;
    Mustache.parse(template);

    function loadForm(form, path) {
        fetch(path + '.json')
            .then((res) => res.json())
            .then((data) => {
                if (data.questions && data.questions.length) {
                    data.questions.forEach((question) => {
                        question.answers = (question.answers || []).map((value, index) => ({value, index}));
                    });

                    form.innerHTML = Mustache.render(template, data);

                    form._validateObject = data.questions.reduce((objValidate, item) => {
                        objValidate[item.id] = item.right;
                        return objValidate;
                    } ,{});
                }
            });
    }

    function equals(v1, v2) {
        if (Array.isArray(v1) || Array.isArray(v2)) {
            if (v1.length === v2.length) {
                return v1.some((key) => v2.indexOf(key) === -1);
            }
            return false;
        } else {
            return String(v1) === String(v2);
        }
    }

    function checkForm(env, event) {
        if (env.form._validateObject) {
            const formData = new FormData(env.form);
            Object.keys(env.form._validateObject).forEach((key)=> {
                let item = env.form.querySelector('[data-question-id="'+key+'"]');

                if (equals(env.form._validateObject[key], formData.get(key))) {
                    item.classList.remove('wrong');
                    item.classList.add('right');
                } else {
                    item.classList.add('wrong');
                    item.classList.remove('right');
                }
            });
        }
        event.preventDefault();
        event.stopPropagation();
    }

    let testState;
    window.endTest = function () {
        if (testState) {
            testState.form.innerHTML = '';
            testState.dialog.close();
        }
    };
    window.openTest = function openTest(path) {
        window.endTest();
        if (path) {
            const dialog = document.getElementById('test-dialog');
            const form = document.getElementById('test-form');

            dialog.showModal();

            loadForm(form, path);
            testState = {
                form,
                dialog,
                path
            };
            form.onsubmit = checkForm.bind(null, testState);
        }
    }
})();