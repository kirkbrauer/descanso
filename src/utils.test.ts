import 'mocha';
import * as chai from 'chai';

import { compareVersions, getLatest } from './utils';
import { Api } from './api';
import { version } from './decorators';

describe('compareVersions', () => {
  it('should correctly compare two simple versions', () => {
    chai.expect(compareVersions('1', '2')).to.equal(-1);
    chai.expect(compareVersions('2', '1')).to.equal(1);
    chai.expect(compareVersions('1', '1')).to.equal(0);
  });
  it('works with major.minor version numbers', () => {
    chai.expect(compareVersions('1.5', '2.1')).to.equal(-1);
    chai.expect(compareVersions('2.2', '1.5')).to.equal(1);
  });
  it('works with major.minor.patch verison numbers', () => {
    chai.expect(compareVersions('1.5.1', '2.1.3')).to.equal(-1);
  });
});

describe('getLatest', () => {
  let apis: Api[];
  before(() => {
    apis = [];
    @version('1.2')
    class Api1 extends Api { }
    @version('1.5')
    class Api2 extends Api { }
    @version('2.3.2')
    class Api3 extends Api { }
    apis.push(new Api2());
    apis.push(new Api1());
    apis.push(new Api3());
  });
  it('finds the latest API', () => {
    const latest = getLatest(apis);
    chai.expect(latest.constructor.prototype.version).to.equal('2.3.2');
  });
});
