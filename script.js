function reset_field(field)
{
    document.getElementById(field).value = null;
}

function reset_all()
{
    document.querySelectorAll('input').forEach(x => x.value = null);
    state.reset();
}

function navigate(link, target)
{
    active = document.getElementsByClassName('btn-nav selected')[0]
    active.classList.remove('selected')
    document.getElementById(active.dataset.target).style.display = 'none';
    document.getElementById(target).style.removeProperty('display');
    link.classList.add('selected');
}

function update(x, v)
{
    document.getElementById(x).innerHTML = v;
}

function save()
{
    navigate(document.getElementById('prev-link'), 'preview');
    document.getElementById('navigation').style.display = 'none';
    window.print();
}

function date_auto()
{
    now = new Date().toISOString().substring(0, 10);
    
    document.getElementById('fecha').innerHTML = date_format(now);
    document.getElementById('date').value = now;
}

function date_select(date)
{
    document.getElementById('fecha').innerHTML = date_format(date);
}

function date_format(date)
{
    months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    return (date.substring(8, 10) + ' de ' + months[+date.substring(5, 7) - 1] + ', ' + date.substring(0, 4));
}

function modal_close()
{
    x = document.getElementsByClassName('popup')[0];
    x.parentNode.removeChild(x);
}

function input(type)
{
    return document.createElement('input').setAttribute('type', type);
}

function preview_update()
{
    preview_prestaciones = document.createElement('p');
    preview_prestaciones.id = 'servicios';

    state.get().forEach(x => {
        tmp = document.createElement('p');
        tmp.style.display = 'flex';
        
        tmp_desc = document.createElement('span');
        tmp_desc.innerHTML = x.desc;
        
        tmp_d = document.createElement('span');
        tmp_d.innerHTML = '.'.repeat(100);
        tmp_d.style.overflow = 'hidden';

        tmp_price = document.createElement('span');
        tmp_price.innerHTML = '$' + x.price.toFixed(3);
        tmp.appendChild(tmp_desc);
        tmp.appendChild(tmp_d);
        tmp.appendChild(tmp_price);

        preview_prestaciones.appendChild(tmp);
    })

    preview_total = document.createElement('p');
    preview_total.id = 'total';
    preview_total.style.display = 'flex';
    preview_total.style.justifyContent = 'space-between';

    preview_total_desc = document.createElement('span');
    preview_total_desc.innerHTML = 'TOTAL'
    
    preview_total_price = document.createElement('span');
    preview_total_price.innerHTML = '$' + state.total();

    preview_total.appendChild(preview_total_desc);
    preview_total.appendChild(preview_total_price);

    document.getElementById('servicios').replaceWith(preview_prestaciones);
    document.getElementById('total').replaceWith(preview_total);
}

function table_load()
{
    if (state.get().length == 0) {
        body = document.createElement('tbody');
        body.style.textAlign = 'center';
        p = document.createElement('p');
        p.innerHTML = 'No prestaciones';
        body.appendChild(p);

        return body;
    }

    body = document.createElement('tbody');

    state.get().forEach((x, i) => {
        tr = document.createElement('tr');
        
        id = document.createElement('td');
        id.innerHTML = i + 1;
        id.setAttribute('align', 'center');
        
        desc = document.createElement('td');
        input = document.createElement('input')
        input.setAttribute('type', 'text');
        input.setAttribute('value', x.desc);
        input.onchange = function() {
            state.update(i, 'desc', this.value);
        }
        desc.style.width = "100%";
        desc.appendChild(input);

        price = document.createElement('td');
        price.setAttribute('align', 'center');
        input = document.createElement('input')
        input.setAttribute('type', 'number');
        input.setAttribute('lang', 'en');
        input.setAttribute('step', 0.001);
        input.setAttribute('value', x.price.toFixed(3));
        input.onchange = function() {
            state.update(i, 'price', +this.value);
        }
        price.appendChild(input);

        action = document.createElement('td');
        btn = document.createElement('button');
        btn.innerHTML = '&#129318;&#127995;';
        btn.onclick = function() {
            state.remove(i);
        }
        action.setAttribute('align', 'center');
        action.appendChild(btn);

        tr.appendChild(id);
        tr.appendChild(desc);
        tr.appendChild(price);
        tr.appendChild(action);

        body.appendChild(tr);
    });

    total = document.createElement('tr');
    head = document.createElement('td');
    head.innerHTML = 'TOTAL';
    sum = document.createElement('td');
    sum.id = 'sum';
    sum.innerHTML = state.total();
    total.appendChild(head);
    total.appendChild(document.createElement('td'));
    total.appendChild(document.createElement('td'));
    total.appendChild(document.createElement('td'));
    total.appendChild(sum);

    body.appendChild(total);

    return body;
}

function table_update()
{
    if (document.getElementsByTagName('tbody')[0]) {
        document.getElementsByTagName('tbody')[0].replaceWith(table_load());
    }
}

function table_build()
{
    table = document.createElement('table');
    thead = document.createElement('thead');

    ['#', 'Intitulado', 'Precio', 'Acción'].forEach(x => {
        th = document.createElement('th');
        th.setAttribute('align', 'left');
        th.innerHTML = x;
        
        thead.appendChild(th);
    });

    table.appendChild(thead);
    table.appendChild(table_load());

    return table;
}

function modal_open()
{
    lock();
    blur();
    
    div = document.createElement('div');
    div.className = 'popup';

    btn = document.createElement('button')
    btn.className = 'popup-header-close';
    btn.innerHTML = 'X';
    btn.onclick = function () {
        modal_close();
        unlock();
        unblur();
    }
    
    header = document.createElement('div');
    header.className = 'popup-header';
    header.innerHTML = 'Beneficios';
    header.appendChild(btn);
    
    div.appendChild(header);
    div.appendChild(table_build());
    
    form = document.createElement('div');
    form.className = 'popup-form';
    
    label_desc = document.createElement('label');
    label_desc.setAttribute('for', 'beneficio_desc');
    label_desc.innerHTML = 'Descripcion';

    input_desc = document.createElement('input');
    input_desc.setAttribute('type', 'text');
    input_desc.setAttribute('id', 'beneficio_desc');
    input_desc.setAttribute('placeholder', 'Descripcion beneficio');
    
    label_price = document.createElement('label');
    label_price.setAttribute('for', 'beneficio_price');
    label_price.innerHTML = 'Precio';

    input_price = document.createElement('input');
    input_price.setAttribute('id', 'beneficio_price');
    input_price.setAttribute('type', 'number');
    input_price.setAttribute('placeholder', 'Precio');

    btn = document.createElement('button');
    btn.innerHTML = 'Agregar';
    btn.className = 'btn-action btn-cta navy';
    btn.onclick = function() {
        desc = document.getElementById('beneficio_desc').value;
        price = document.getElementById('beneficio_price').value;
        state.add({ desc: desc, price: Number(price) });
        document.getElementById('beneficio_desc').value = null;
        document.getElementById('beneficio_price').value = null;
    }
    
    form.appendChild(label_desc);
    form.appendChild(input_desc);
    form.appendChild(label_price);
    form.appendChild(input_price);
    form.appendChild(btn);
    
    
    div.appendChild(form);
    
    document.body.appendChild(div);
}

function blur()
{
    div = document.createElement('div');
    div.className = 'blur';
    div.onclick = function() {
        modal_close();
        unblur();
        unlock();
    }

    document.body.appendChild(div);
}

function unblur()
{
    x = document.getElementsByClassName('blur')[0];
    x.parentNode.removeChild(x);
}

function lock()
{
    document.body.style.overflowY = 'hidden';
}

function unlock()
{
    document.body.style.overflowY = '';
}

function State()
{
    let x = [];

    State.prototype.get = function(v) {
        return x;
    }

    State.prototype.add = function(v) {
        x.push(v);
        table_update();
        preview_update();
    }

    State.prototype.remove = function(i) {
        x.splice(i, 1);
        table_update();
        preview_update();
    }

    State.prototype.update = function(i, k, v) {
        x[i][k] = v;
        table_update();
        preview_update();
    }

    State.prototype.reset = function(i, k, v) {
        x = [];
        table_update();
        preview_update();
    }

    State.prototype.total = function() {
        return x.reduce((ac, cv) => ac + cv['price'], 0).toFixed(3);
    }
}

let state = new State();

function observe()
{
    console.log("change detected")
}

function element_add()
{
    state.add({ desc: 'Tekken', price: 300.000 });
}

window.onafterprint = () => {
    document.getElementById('navigation').style.removeProperty('display');
};