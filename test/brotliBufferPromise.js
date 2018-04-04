'use strict';

const brotli = require('../');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const path = require('path');

function testBufferPromise(method, bufferFile, resultFile, done, params) {
  params = params || {};
  const buffer = fs.readFileSync(path.join(__dirname, '/fixtures/', bufferFile));
  const result = fs.readFileSync(path.join(__dirname, '/fixtures/', resultFile));

  if (method.name === 'compress') {
    method(buffer, params).then(function(output) {
      expect(output).to.deep.equal(result);
      done();
    });
  }

  if (method.name === 'decompress') {
    method(buffer).then(function(output) {
      expect(output).to.deep.equal(result);
      done();
    });
  }
}

describe('Brotli Buffer Promise', function() {
  describe('compress', function() {
    it('should compress binary data', function(done) {
      testBufferPromise(brotli.compress, 'data10k.bin', 'data10k.bin.compressed', done);
    });

    it('should compress text data', function(done) {
      testBufferPromise(brotli.compress, 'data.txt', 'data.txt.compressed', done);
    });

    it('should compress text data with quality=3', function(done) {
      testBufferPromise(brotli.compress, 'data.txt', 'data.txt.compressed.03', done, { quality: 3 });
    });

    it('should compress text data with quality=9', function(done) {
      testBufferPromise(brotli.compress, 'data.txt', 'data.txt.compressed.09', done, { quality: 9 });
    });

    it('should compress an empty buffer', function(done) {
      testBufferPromise(brotli.compress, 'empty', 'empty.compressed', done);
    });

    it('should compress a random buffer', function(done) {
      this.timeout(30000);
      testBufferPromise(brotli.compress, 'rand', 'rand.compressed', done);
    });

    it('should compress a large buffer', function(done) {
      if (process.env.SKIP_LARGE_BUFFER_TEST) {
        this.skip();
      }

      this.timeout(30000);
      testBufferPromise(brotli.compress, 'large.txt', 'large.txt.compressed', done);
    });
  });

  describe('decompress', function() {
    it('should decompress binary data', function(done) {
      testBufferPromise(brotli.decompress, 'data10k.bin.compressed', 'data10k.bin', done);
    });

    it('should decompress text data', function(done) {
      testBufferPromise(brotli.decompress, 'data.txt.compressed', 'data.txt', done);
    });

    it('should decompress to an empty buffer', function(done) {
      testBufferPromise(brotli.decompress, 'empty.compressed', 'empty', done);
    });

    it('should decompress a random buffer', function(done) {
      testBufferPromise(brotli.decompress, 'rand.compressed', 'rand', done);
    });

    it('should decompress to a large buffer', function(done) {
      this.timeout(30000);
      testBufferPromise(brotli.decompress, 'large.compressed', 'large', done);
    });

    it('should decompress to another large buffer', function(done) {
      if (process.env.SKIP_LARGE_BUFFER_TEST) {
        this.skip();
      }

      this.timeout(30000);
      testBufferPromise(brotli.decompress, 'large.txt.compressed', 'large.txt', done);
    });
  });
});
