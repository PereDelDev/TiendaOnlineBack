function sumar(numA, numB) {
    return numA + numB
}



describe('Test de pruebas', () => {

    it('que la función sumar devuelva un resultado', () => {
        const resultado = sumar(5, 5);
        expect(resultado).toBe(10);
        expect(sumar(7, 2)).toBe(9)
    })

})