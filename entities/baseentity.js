'use strict';

/**
 * Represents an in-game entity.
 */
class BaseEntity {
  constructor(demo, index, classId, serialNum, baseline) {
    this._demo = demo;

    /**
     * Entity index.
     * @type {int}
     */
    this.index = index;

    /**
     * Server class ID.
     * @type {int}
     */
    this.classId = classId;

    /**
     * Serial number.
     * @type {int}
     */
    this.serialNum = serialNum;

    /**
     * Entity is scheduled for removal this tick.
     * @type {bool}
     */
    this.deleting = false;

    this.props = baseline || {};
  }

  /**
   * Retrieves the value of a networked property
   * @param {string} tableName - Table name (e.g., DT_BaseEntity)
   * @param {string} varName - Network variable name (e.g., m_vecOrigin)
   * @returns {*} Property value, `undefined` if non-existent
   * @public
   */
  getProp(tableName, varName) {
    var value = this.props[tableName] && this.props[tableName][varName];

    if (value === undefined && this.baseline) {
      return this.baseline[tableName] && this.baseline[tableName][varName];
    } else {
      return value;
    }
  }

  updateProp(tableName, varName, newValue) {
    if (this.props[tableName] === undefined) {
      this.props[tableName] = {[varName]: newValue};
    } else {
      this.props[tableName][varName] = newValue;
    }
  }

  /**
   * Get the serverclass associated with this entity.
   * @returns {object} Object representing the entity's class
   */
  get serverClass() {
    return this._demo.entities.serverClasses[this.classId];
  }

  /**
   * Position of this entity in the game world.
   * @returns {object} {x, y, z} world-space coordinates
   */
  get position() {
    return this.getProp('DT_BaseEntity', 'm_vecOrigin');
  }

  /**
   * Velocity of the entity.
   * @returns {object} {x, y, z} speed in each axis
   */
  get velocity() {
    return this.getProp('DT_BaseEntity', 'm_vecVelocity');
  }

  /**
   * Speed of the entity.
   * @returns {number}
   */
  get speed() {
    var vel = this.velocity;
    return Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
  }

  /**
   * @returns {Entity|null} Owning entity, if it exists
   */
  get owner() {
    return this._demo.entities.getByHandle(this.getProp('DT_BaseEntity', 'm_hOwnerEntity'));
  }

  /**
   * @returns {int} Team number (0: Unassigned, 1: Spectator, 2: Terrorist, 3: Counter-Terrorist)
   */
  get teamNumber() {
    return this.getProp('DT_BaseEntity', 'm_iTeamNum');
  }

  /**
   * @returns {Team|null} Team if assigned, null if unassigned.
   */
  get team() {
    let teamNum = this.teamNumber;
    if (teamNum === 0) {
      return null;
    }

    return this._demo.entities.teams[teamNum];
  }
}

module.exports = BaseEntity;
