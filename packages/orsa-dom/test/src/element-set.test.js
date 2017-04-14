const expect = require('chai').expect;
const ElementSet = require('../../src/element-set');
const Element = require('../../src/element');

class VersionedElement extends Element {
  constructor(parent, version, metadata = {}) {
    super(parent, metadata);
    this.setPersistedAttributes([
      'version',
    ]);
    this.version = version;
    this.type = 'VersionedElement';
  }
}

describe('orsa project', () => {
  it('should emit on add', (done) => {
    const es = new ElementSet(null);
    es.on(ElementSet.ADD, (obj, data) => {
      expect(es === obj).to.be.true;
      expect(data).to.eql(1);
      done();
    });
    es.add(1);
  });

  it('should merge on when matched', () => {
    const es = new ElementSet(null, {
      identityMatchers: [
        (a, b) => a.type === b.type,
      ],
    });

    const ve1 = es.add(new VersionedElement(null, 1, {
      fooz: 'baz',
      flooz: 'bar',
    }));
    expect(es.toArray().length).to.eql(1);
    expect(ve1.metadata.get('fooz')).to.eql('baz');
    expect(ve1.metadata.get('flooz')).to.eql('bar');

    es.add(new Element(null, {}));
    expect(es.toArray().length).to.eql(2);

    const ve2 = es.add(new VersionedElement(null, 2, {
      fooz: 'bloop',
    }));
    expect(es.toArray().length).to.eql(2);
    expect(ve2.version).to.eql(2);
    expect(ve2.metadata.get('fooz')).to.eql('bloop');
    expect(ve2.metadata.get('flooz')).to.eql('bar');
    expect(ve1 === ve2).to.be.true;
  });

  it('should find kids', () => {
    const es = new ElementSet(null);
    es.add(new Element(null, {
      fooz: 'baz',
    }));
    es.add(new Element(null, {
      fooz: 'baz',
    }));
    es.add(new Element(null, {
      fooz: 'bar',
    }));
    expect(es.find({
      metadata: {
        fooz: 'baz',
      },
    }).length).to.eql(2);
  });

  it('should emit on remove', (done) => {
    const es = new ElementSet(null);
    es.on(ElementSet.REMOVE, (obj, data) => {
      expect(es === obj).to.be.true;
      expect(data).to.eql(2);
      done();
    });
    es.add(2);
    es.add(1);
    es.remove(2);
    expect(es.toArray()).to.eql([
      1,
    ]);
  });
});
