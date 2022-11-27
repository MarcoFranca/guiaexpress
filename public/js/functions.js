    function deleteConfirm (event, form){
    event.preventDefault()
    let decision = confirm("Você realmente deseja deletar permanentemente esta categoria?")
    if (decision){
    form.submit()
}
}
