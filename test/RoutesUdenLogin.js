var app = require('./../server.js');
var request = require('supertest');
var server = request.agent(app);

describe('Routes uden login', function(){
    before(function (done) {
        server
            .get('/login/logout')
            .expect(302, done);
    });

// VAREKATEGORI
// =============================================================================
    describe('Varekategori', function(){
        it('Alle varekategorier', function(done){
            server
                .get('/varekategori')
                .expect('Location', '/login')
                .expect(302, done);
        });
        it('Alle vare i en bestemt kategori', function(done){
            server
                .get('/varekategori/59076e76f44961273860a8dc')
                .expect('Location', '/login')
                .expect(302, done);
        });
    });

// VARE
// =============================================================================
    describe('Vare', function(){
        it('Alle vare', function(done){
            server
                .get('/vare')
                .expect('Location', '/login')
                .expect(302, done);
        });
        it('En bestemt vare', function(done){
            server
                .get('/vare/59077a74c00de719e8531f38')
                .expect('Location', '/login')
                .expect(302, done);
        });
    });

// BESTILLING
// =============================================================================
    describe('Bestilling', function(){
        it('Alle bestillinger', function(done){
            server
                .get('/bestilling')
                .expect('Location', '/login')
                .expect(302, done);
        });
        it('En bestemt bestilling', function(done){
            server
                .get('/bestilling/5922fa3de98d430011ce2aa4')
                .expect('Location', '/login')
                .expect(302, done);
        });
        it('Bestillinger på en bestemt dato', function(done){
            server
                .get('/bestilling/dato/2017-05-22')
                .expect('Location', '/login')
                .expect(302, done);
        });
        it('Bestillinger i et bestemt dato interval', function(done){
            server
                .get('/bestilling/dato/2017-05-22/2017-05-28')
                .expect('Location', '/login')
                .expect(302, done);
        });
    });

// MEDARBEJDER
// =============================================================================
    describe('Medarbejder', function(){
        it('Alle medarbejdere', function(done){
            server
                .get('/medarbejder')
                .expect('Location', '/login')
                .expect(302, done);
        });
        it('En bestemt medarbejder', function(done){
            server
                .get('/medarbejder/5908752aabf3c11c48d2efc9')
                .expect('Location', '/login')
                .expect(302, done);
        });
    });
});