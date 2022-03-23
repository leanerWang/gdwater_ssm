/**
 *@author xinlei
 *@infor 修改了部分，添加了参数 particleNumber、_created、particleId
 *@infor 使粒子系统在一定的范围内创造给定数量的粒子，便于逐粒子操作
 */

var defaultImageSize = new Cesium.Cartesian2(1.0, 1.0);
function XLParticleSystem(options) {
  options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);

  this.particleNumber = Cesium.defaultValue(options.particleNumber,100)
  this._created = false
  this.particleId = 0 //给粒子添加id
  //this.endPosition = undefined //终点位置

  /**
   * Whether to display the Cesium.Particle system.
   * @type {Boolean}
   * @default true
   */
  this.show = Cesium.defaultValue(options.show, true);

  /**
   * An array of force callbacks. The callback is passed a {@link Cesium.Particle} and the difference from the last time
   * @type {Cesium.XLParticleSystem.updateCallback}
   * @default undefined
   */
  this.updateCallback = options.updateCallback;

  /**
   * Whether the Cesium.Particle system should loop it's bursts when it is complete.
   * @type {Boolean}
   * @default true
   */
  this.loop = Cesium.defaultValue(options.loop, true);

  /**
   * The URI, HTMLImageElement, or HTMLCanvasElement to use for the billboard.
   * @type {Object}
   * @default undefined
   */
  this.image = Cesium.defaultValue(options.image, undefined);

  var emitter = options.emitter;
  if (!Cesium.defined(emitter)) {
    emitter = new Cesium.CircleEmitter(0.5);
  }
  this._emitter = emitter;

  this._bursts = options.bursts;

  this._modelMatrix = Cesium.Matrix4.clone(
    Cesium.defaultValue(options.modelMatrix, Cesium.Matrix4.IDENTITY)
  );
  this._emitterModelMatrix = Cesium.Matrix4.clone(
    Cesium.defaultValue(options.emitterModelMatrix, Cesium.Matrix4.IDENTITY)
  );
  this._matrixDirty = true;
  this._combinedMatrix = new Cesium.Matrix4();

  this._startColor = Cesium.Color.clone(
    Cesium.defaultValue(options.Color, Cesium.defaultValue(options.startColor, Cesium.Color.WHITE))
  );
  this._endColor = Cesium.Color.clone(
    Cesium.defaultValue(options.Color, Cesium.defaultValue(options.endColor, Cesium.Color.WHITE))
  );

  this._startScale = Cesium.defaultValue(
    options.scale,
    Cesium.defaultValue(options.startScale, 1.0)
  );
  this._endScale = Cesium.defaultValue(
    options.scale,
    Cesium.defaultValue(options.endScale, 1.0)
  );

  this._emissionRate = Cesium.defaultValue(options.emissionRate, 5.0);

  this._minimumSpeed = Cesium.defaultValue(
    options.speed,
    Cesium.defaultValue(options.minimumSpeed, 1.0)
  );
  this._maximumSpeed = Cesium.defaultValue(
    options.speed,
    Cesium.defaultValue(options.maximumSpeed, 1.0)
  );

  this._minimumParticleLife = Cesium.defaultValue(
    options.ParticleLife,
    Cesium.defaultValue(options.minimumParticleLife, 5.0)
  );
  this._maximumParticleLife = Cesium.defaultValue(
    options.ParticleLife,
    Cesium.defaultValue(options.maximumParticleLife, 5.0)
  );

  this._minimumMass = Cesium.defaultValue(
    options.mass,
    Cesium.defaultValue(options.minimumMass, 1.0)
  );
  this._maximumMass = Cesium.defaultValue(
    options.mass,
    Cesium.defaultValue(options.maximumMass, 1.0)
  );

  this._minimumImageSize = Cesium.Cartesian2.clone(
    Cesium.defaultValue(
      options.imageSize,
      Cesium.defaultValue(options.minimumImageSize, defaultImageSize)
    )
  );
  this._maximumImageSize = Cesium.Cartesian2.clone(
    Cesium.defaultValue(
      options.imageSize,
      Cesium.defaultValue(options.maximumImageSize, defaultImageSize)
    )
  );

  this._sizeInMeters = Cesium.defaultValue(options.sizeInMeters, false);

  this._lifetime = Cesium.defaultValue(options.lifetime, Number.MAX_VALUE);

  this._BillboardCollection = undefined;//存放粒子图片
  this._Particles = [];

  // An array of available Cesium.Particles that we can reuse instead of allocating new.
  this._ParticlePool = [];

  this._previousTime = undefined;
  this._currentTime = 0.0;
  this._carryOver = 0.0;

  this._complete = new Cesium.Event();
  this._isComplete = false;

  this._updateParticlePool = true;
  this._ParticleEstimate = 0;
}

Object.defineProperties(XLParticleSystem.prototype, {

  /**
   * The Cesium.Particle emitter for this
   * @memberof Cesium.XLParticleSystem.prototype
   * @type {Cesium.ParticleEmitter}
   * @default Cesium.CircleEmitter
   */
  emitter: {
    get: function () {
      return this._emitter;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.defined("value", value);
      //>>includeEnd('debug');
      this._emitter = value;
    },
  },
  /**
   * An array of {@link Cesium.ParticleBurst}, emitting bursts of Particles at periodic times.
   * @memberof XLParticleSystem.prototype
   * @type {ParticleBurst[]}
   * @default undefined
   */
  bursts: {
    get: function () {
      return this._bursts;
    },
    set: function (value) {
      this._bursts = value;
      this._updateParticlePool = true;
    },
  },
  /**
   * The 4x4 transformation matrix that transforms the Cesium.Particle system from model to world coordinates.
   * @memberof Cesium.XLParticleSystem.prototype
   * @type {Cesium.Matrix4}
   * @default Cesium.Matrix4.IDENTITY
   */
  modelMatrix: {
    get: function () {
      return this._modelMatrix;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.defined("value", value);
      //>>includeEnd('debug');
      this._matrixDirty =
        this._matrixDirty || !Cesium.Matrix4.equals(this._modelMatrix, value);
      Cesium.Matrix4.clone(value, this._modelMatrix);
    },
  },
  /**
   * The 4x4 transformation matrix that transforms the Particle system emitter within the Particle systems local coordinate system.
   * @memberof XLParticleSystem.prototype
   * @type {Matrix4}
   * @default Cesium.Matrix4.IDENTITY
   */
  emitterModelMatrix: {
    get: function () {
      return this._emitterModelMatrix;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.Cesium.defined("value", value);
      //>>includeEnd('debug');
      this._matrixDirty =
        this._matrixDirty || !Cesium.Matrix4.equals(this._emitterModelMatrix, value);
      Cesium.Matrix4.clone(value, this._emitterModelMatrix);
    },
  },
  /**
   * The Color of the Particle at the beginning of its life.
   * @memberof XLParticleSystem.prototype
   * @type {Color}
   * @default Color.WHITE
   */
  startColor: {
    get: function () {
      return this._startColor;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.defined("value", value);
      //>>includeEnd('debug');
      Cesium.Color.clone(value, this._startColor);
    },
  },
  /**
   * The Color of the Particle at the end of its life.
   * @memberof XLParticleSystem.prototype
   * @type {Color}
   * @default Cesium.Color.WHITE
   */
  endColor: {
    get: function () {
      return this._endColor;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.defined("value", value);
      //>>includeEnd('debug');
      Cesium.Color.clone(value, this._endColor);
    },
  },
  /**
   * The initial scale to apply to the image of the Cesium.Particle at the beginning of its life.
   * @memberof Cesium.XLParticleSystem.prototype
   * @type {Number}
   * @default 1.0
   */
  startScale: {
    get: function () {
      return this._startScale;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value", value, 0.0);
      //>>includeEnd('debug');
      this._startScale = value;
    },
  },
  /**
   * The final scale to apply to the image of the Cesium.Particle at the end of its life.
   * @memberof Cesium.XLParticleSystem.prototype
   * @type {Number}
   * @default 1.0
   */
  endScale: {
    get: function () {
      return this._endScale;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value", value, 0.0);
      //>>includeEnd('debug');
      this._endScale = value;
    },
  },
  /**
   * The number of Cesium.Particles to emit per second.
   * @memberof Cesium.XLParticleSystem.prototype
   * @type {Number}
   * @default 5
   */
  emissionRate: {
    get: function () {
      return this._emissionRate;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value", value, 0.0);
      //>>includeEnd('debug');
      this._emissionRate = value;
      this._updateParticlePool = true;
    },
  },
  /**
   * Sets the minimum bound in meters per second above which a Cesium.Particle's actual speed will be randomly chosen.
   * @memberof Cesium.XLParticleSystem.prototype
   * @type {Number}
   * @default 1.0
   */
  minimumSpeed: {
    get: function () {
      return this._minimumSpeed;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value", value, 0.0);
      //>>includeEnd('debug');
      this._minimumSpeed = value;
    },
  },
  /**
   * Sets the maximum bound in meters per second below which a Cesium.Particle's actual speed will be randomly chosen.
   * @memberof Cesium.XLParticleSystem.prototype
   * @type {Number}
   * @default 1.0
   */
  maximumSpeed: {
    get: function () {
      return this._maximumSpeed;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value", value, 0.0);
      //>>includeEnd('debug');
      this._maximumSpeed = value;
    },
  },
  /**
   * Sets the minimum bound in seconds for the possible duration of a Cesium.Particle's life above which a Cesium.Particle's actual life will be randomly chosen.
   * @memberof Cesium.XLParticleSystem.prototype
   * @type {Number}
   * @default 5.0
   */
  minimumParticleLife: {
    get: function () {
      return this._minimumParticleLife;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value", value, 0.0);
      //>>includeEnd('debug');
      this._minimumParticleLife = value;
    },
  },
  /**
   * Sets the maximum bound in seconds for the possible duration of a Cesium.Particle's life below which a Cesium.Particle's actual life will be randomly chosen.
   * @memberof Cesium.XLParticleSystem.prototype
   * @type {Number}
   * @default 5.0
   */
  maximumParticleLife: {
    get: function () {
      return this._maximumParticleLife;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value", value, 0.0);
      //>>includeEnd('debug');
      this._maximumParticleLife = value;
      this._updateParticlePool = true;
    },
  },
  /**
   * Sets the minimum mass of Cesium.Particles in kilograms.
   * @memberof Cesium.XLParticleSystem.prototype
   * @type {Number}
   * @default 1.0
   */
  minimumMass: {
    get: function () {
      return this._minimumMass;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value", value, 0.0);
      //>>includeEnd('debug');
      this._minimumMass = value;
    },
  },
  /**
   * Sets the maximum mass of Particles in kilograms.
   * @memberof XLParticleSystem.prototype
   * @type {Number}
   * @default 1.0
   */
  maximumMass: {
    get: function () {
      return this._maximumMass;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value", value, 0.0);
      //>>includeEnd('debug');
      this._maximumMass = value;
    },
  },
  /**
   * Sets the minimum bound, width by height, above which to randomly scale the Particle image's dimensions in pixels.
   * @memberof XLParticleSystem.prototype
   * @type {Cartesian2}
   * @default new Cesium.Cartesian2(1.0, 1.0)
   */
  minimumImageSize: {
    get: function () {
      return this._minimumImageSize;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.typeOf.object("value", value);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value.x", value.x, 0.0);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value.y", value.y, 0.0);
      //>>includeEnd('debug');
      this._minimumImageSize = value;
    },
  },
  /**
   * Sets the maximum bound, width by height, below which to randomly scale the Particle image's dimensions in pixels.
   * @memberof XLParticleSystem.prototype
   * @type {Cartesian2}
   * @default new Cesium.Cartesian2(1.0, 1.0)
   */
  maximumImageSize: {
    get: function () {
      return this._maximumImageSize;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.typeOf.object("value", value);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value.x", value.x, 0.0);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value.y", value.y, 0.0);
      //>>includeEnd('debug');
      this._maximumImageSize = value;
    },
  },
  /**
   * Gets or sets if the Particle size is in meters or pixels. <code>true</code> to size Particles in meters; otherwise, the size is in pixels.
   * @memberof XLParticleSystem.prototype
   * @type {Boolean}
   * @default false
   */
  sizeInMeters: {
    get: function () {
      return this._sizeInMeters;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.typeOf.bool("value", value);
      //>>includeEnd('debug');
      this._sizeInMeters = value;
    },
  },
  /**
   * How long the Particle system will emit Particles, in seconds.
   * @memberof XLParticleSystem.prototype
   * @type {Number}
   * @default Number.MAX_VALUE
   */
  lifetime: {
    get: function () {
      return this._lifetime;
    },
    set: function (value) {
      //>>includeStart('debug', pragmas.debug);
      Cesium.Check.typeOf.number.greaterThanOrEquals("value", value, 0.0);
      //>>includeEnd('debug');
      this._lifetime = value;
    },
  },
  /**
   * Fires an Event when the Particle system has reached the end of its lifetime.
   * @memberof XLParticleSystem.prototype
   * @type {Event}
   */
  complete: {
    get: function () {
      return this._complete;
    },
  },
  /**
   * When <code>true</code>, the Cesium.Particle system has reached the end of its lifetime; <code>false</code> otherwise.
   * @memberof XLParticleSystem.prototype
   * @type {Boolean}
   */
  isComplete: {
    get: function () {
      return this._isComplete;
    },
  },
});

function updateParticlePool(system) {//创建一次循环中所有的粒子，放入粒子回收池中
  var emissionRate = system._emissionRate;
  var life = system._maximumParticleLife;

  var burstAmount = 0;
  var bursts = system._bursts;
  if (Cesium.defined(bursts)) {
    var length = bursts.length;
    for (var i = 0; i < length; ++i) {
      burstAmount += bursts[i].maximum;
    }
  }

  var BillboardCollection = system._BillboardCollection;
  var image = system.image;

  var ParticleEstimate = Math.ceil(emissionRate * life + burstAmount);//一次循环中最大的粒子个数
  var Particles = system._Particles;//当前存活的粒子池
  var ParticlePool = system._ParticlePool;//粒子回收池
  var numToAdd = Math.max(//还要继续增加的粒子数量
    ParticleEstimate - Particles.length - ParticlePool.length,
    0
  );

  for (var j = 0; j < numToAdd; ++j) {
    var Particle = new Cesium.Particle();
    Particle._billboard = BillboardCollection.add({
      image: image,
    });
    ParticlePool.push(Particle);
  }//所有粒子创建完成

  system._ParticleEstimate = ParticleEstimate;
}

function getOrCreateParticle(system) {//从池中获取粒子，没有就创建
  // Try to reuse an existing Particle from the pool.
  var Particle = system._ParticlePool.pop();
  if (!Cesium.defined(Particle)) {
    // Create a new one
    Particle = new Cesium.Particle();
  }
  return Particle;
}

function addParticleToPool(system, Particle) {//添加粒子进池中
  system._ParticlePool.push(Particle);
}

function freeParticlePool(system) {
  var Particles = system._Particles;
  var ParticlePool = system._ParticlePool;
  var BillboardCollection = system._BillboardCollection;

  var numParticles = Particles.length;//现存粒子数量
  var numInPool = ParticlePool.length;//池中粒子数量
  var estimate = system._ParticleEstimate;//最大粒子数量

  var start = numInPool - Math.max(estimate - numParticles - numInPool, 0);
  for (var i = start; i < numInPool; ++i) {
    var p = ParticlePool[i];
    BillboardCollection.remove(p._billboard);
  }
  ParticlePool.length = start;
}

function removeBillboard(Particle) {
  if (Cesium.defined(Particle._billboard)) {
    Particle._billboard.show = false;
  }
}

function updateBillboard(system, Particle) {//更新粒子图片大小、颜色随时间变化的结果
  var billboard = Particle._billboard;
  if (!Cesium.defined(billboard)) {
    billboard = Particle._billboard = system._BillboardCollection.add({
      image: Particle.image,
    });
  }
  billboard.width = Particle.imageSize.x;
  billboard.height = Particle.imageSize.y;
  billboard.position = Particle.position;
  billboard.sizeInMeters = system.sizeInMeters;
  billboard.show = true;

  // Update the Color
  var r = Cesium.Math.lerp(
    Particle.startColor.red,
    Particle.endColor.red,
    Particle.normalizedAge
  );
  var g = Cesium.Math.lerp(
    Particle.startColor.green,
    Particle.endColor.green,
    Particle.normalizedAge
  );
  var b = Cesium.Math.lerp(
    Particle.startColor.blue,
    Particle.endColor.blue,
    Particle.normalizedAge
  );
  var a = Cesium.Math.lerp(
    Particle.startColor.alpha,
    Particle.endColor.alpha,
    Particle.normalizedAge
  );
  billboard.color = new Cesium.Color(r, g, b, a);

  // Update the scale
  billboard.scale = Cesium.Math.lerp(
    Particle.startScale,
    Particle.endScale,
    Particle.normalizedAge
  );
}

function addParticle(system, Particle) {//把系统的各参数赋给粒子
    Particle.id = system.particleId
    // Particle.prototype.endPosition = system.endPosition
  Particle.startColor = Cesium.Color.clone(system._startColor, Particle.startColor);
  Particle.endColor = Cesium.Color.clone(system._endColor, Particle.endColor);
  Particle.startScale = system._startScale;
  Particle.endScale = system._endScale;
  Particle.image = system.image;
  Particle.life = Cesium.Math.randomBetween(
    system._minimumParticleLife,
    system._maximumParticleLife
  );
  Particle.mass = Cesium.Math.randomBetween(
    system._minimumMass,
    system._maximumMass
  );
  Particle.imageSize.x = Cesium.Math.randomBetween(
    system._minimumImageSize.x,
    system._maximumImageSize.x
  );
  Particle.imageSize.y = Cesium.Math.randomBetween(
    system._minimumImageSize.y,
    system._maximumImageSize.y
  );

  // Reset the normalizedAge and age in case the Particle was reused.
  Particle._normalizedAge = 0.0;
  Particle._age = 0.0;

  var speed = Cesium.Math.randomBetween(
    system._minimumSpeed,
    system._maximumSpeed
  );
  Cesium.Cartesian3.multiplyByScalar(Particle.velocity, speed, Particle.velocity);

  system._Particles.push(Particle);
}

function calculateNumberToEmit(system, dt) {
  // This emitter is finished if it exceeds it's lifetime.
  if (system._isComplete) {
    return 0;
  }

  dt = Cesium.Math.mod(dt, system._lifetime);//dt为距离上次更新的时间，当大于一次循环时间之后就取离上次循环经历的时间

  // Compute the number of Particles to emit based on the emissionRate.
  var v = dt * system._emissionRate;
  var numToEmit = Math.floor(v);//numToEmit为这段时间内需要发射的粒子数量
  system._carryOver += v - numToEmit;//？怎么会大于1.0
  if (system._carryOver > 1.0) {
    numToEmit++;
    system._carryOver -= 1.0;
  }

  // Apply any bursts
  if (Cesium.defined(system.bursts)) {//指定时间内产生大量粒子
    var length = system.bursts.length;
    for (var i = 0; i < length; i++) {
      var burst = system.bursts[i];
      var currentTime = system._currentTime;
      if (Cesium.defined(burst) && !burst._complete && currentTime > burst.time) {
        numToEmit += Math.randomBetween(burst.minimum, burst.maximum);
        burst._complete = true;
      }
    }
  }

  return numToEmit;//返回当前循环已经发射的粒子数量
}

var rotatedVelocityScratch = new Cesium.Cartesian3();

/**
 * @private
 */
XLParticleSystem.prototype.update = function (frameState) {
  if (!this.show) {
    return;
  }

  if (!Cesium.defined(this._BillboardCollection)) {
    this._BillboardCollection = new Cesium.BillboardCollection();
  }

  if (this._updateParticlePool) {
    updateParticlePool(this);
    this._updateParticlePool = false;//已经更新过粒子池了
  }

  // Compute the frame time
  var dt = 0.0;
  if (this._previousTime) {//粒子更新时间间隔
    dt = Cesium.JulianDate.secondsDifference(frameState.time, this._previousTime);
  }

  if (dt < 0.0) {
    dt = 0.0;
  }

  var Particles = this._Particles;
  var emitter = this._emitter;
  var updateCallback = this.updateCallback;

  var i;
  var Particle;

  // update Particles and remove dead Particles
  var length = Particles.length;
  for (i = 0; i < length; ++i) {
   Particle = Particles[i];
   // if (!Particle.update(dt, updateCallback)) {
     // removeBillboard(Particle);
      // Add the Particle back to the pool so it can be reused.
    //  addParticleToPool(this, Particle);
   //   Particles[i] = Particles[length - 1];
   //   --i;
   //   --length;
   // } else {
    Particle.update(dt, updateCallback)
    updateBillboard(this, Particle);
 //   }
  }//这种循环花里胡哨的
 // Particles.length = length;

  //var numToEmit = calculateNumberToEmit(this, dt);

  if ( Cesium.defined(emitter)) {//numToEmit > 0 &&
    // Compute the final model matrix by combining the Cesium.Particle systems model matrix and the emitter matrix.
    if (this._matrixDirty) {
      this._combinedMatrix = Cesium.Matrix4.multiply(
        this.modelMatrix,
        this.emitterModelMatrix,
        this._combinedMatrix
      );
      this._matrixDirty = false;//避免重复计算
    }

    var combinedMatrix = this._combinedMatrix;//粒子发射初始位置的转换矩阵

    if (!this._created) {
        for (i = 0; i < this.particleNumber; i++) {
        // Create a new Particle.
        Particle = getOrCreateParticle(this);

        // Let the emitter initialize the Particle.
        this._emitter.emit(Particle);//初始化粒子，坐标和速度为模型中的坐标

        //For the velocity we need to add it to the original position and then multiply by point.
        Cesium.Cartesian3.add(
            Particle.position,
            Particle.velocity,
            rotatedVelocityScratch
        );//改正速度方向为粒子的投放位置
        Cesium.Matrix4.multiplyByPoint(
            combinedMatrix,
            rotatedVelocityScratch,
            rotatedVelocityScratch
        );//转换为世界坐标

        // Change the position to be in world coordinates
        Particle.position = Cesium.Matrix4.multiplyByPoint(
            combinedMatrix,
            Particle.position,
            Particle.position
        );//转换为世界坐标

        // Orient the velocity in world space as well.
        Cesium.Cartesian3.subtract(
            rotatedVelocityScratch,
            Particle.position,
            Particle.velocity
        );
        Cesium.Cartesian3.normalize(Particle.velocity, Particle.velocity);

        // Add the Cesium.Particle to the system.
        addParticle(this, Particle);
        updateBillboard(this, Particle);
        this.particleId ++
        }
        this._created = true
    }
  }

  this._BillboardCollection.update(frameState);
  this._previousTime = Cesium.JulianDate.clone(frameState.time, this._previousTime);
  this._currentTime += dt;

  if (
    this._lifetime !== Number.MAX_VALUE &&
    this._currentTime > this._lifetime
  ) {
    if (this.loop) {
      this._currentTime = Cesium.Math.mod(this._currentTime, this._lifetime);
      if (this.bursts) {
        var burstLength = this.bursts.length;
        // Reset any bursts
        for (i = 0; i < burstLength; i++) {
          this.bursts[i]._complete = false;
        }
      }
    } else {
      this._isComplete = true;
      this._complete.raiseEvent(this);//监听事件
    }
  }

  // free Particles in the pool and release billboard GPU memory
  if (frameState.frameNumber % 120 === 0) {
    freeParticlePool(this);
  }
};

/**
 * Returns true if this object was destroyed; otherwise, false.
 * <br /><br />
 * If this object was destroyed, it should not be used; calling any function other than
 * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.
 *
 * @returns {Boolean} <code>true</code> if this object was destroyed; otherwise, <code>false</code>.
 *
 * @see XLParticleSystem#destroy
 */
XLParticleSystem.prototype.isDestroyed = function () {
  return false;
};

/**
 * Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
 * release of WebGL resources, instead of relying on the garbage collector to destroy this object.
 * <br /><br />
 * Once an object is destroyed, it should not be used; calling any function other than
 * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.  Therefore,
 * assign the return value (<code>undefined</code>) to the object as done in the example.
 *
 * @exception {DeveloperError} This object was destroyed, i.e., destroy() was called.
 *
 * @see XLParticleSystem#isDestroyed
 */
XLParticleSystem.prototype.destroy = function () {
  this._BillboardCollection =
    this._BillboardCollection && this._BillboardCollection.destroy();
  return destroyObject(this);
};

/**
 * A function used to modify attributes of the Particle at each time step. This can include force modifications,
 * Color, sizing, etc.
 *
 * @callback XLParticleSystem.updateCallback
 *
 * @param {Particle} Particle The Particle being updated.
 * @param {Number} dt The time in seconds since the last update.
 *
 * @example
 * function applyGravity(Particle, dt) {
 *    var position = Particle.position;
 *    var gravityVector = Cartesian3.normalize(position, new Cartesian3());
 *    Cartesian3.multiplyByScalar(gravityVector, GRAVITATIONAL_CONSTANT * dt, gravityVector);
 *    Particle.velocity = Cartesian3.add(Particle.velocity, gravityVector, Particle.velocity);
 * }
 */
export default XLParticleSystem;
