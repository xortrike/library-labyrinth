/**
 * Generate labyrinth on based method backtracking.
 * @class Labyrinth
 * @version 1.0.0
 * @author Xortrike
 * @license GNU General Public License v3.0
 * @link https://github.com/xortrike/library-labyrinth.git
 */
class Labyrinth
{
	/**
	 * Set default options
	 * @constructor
	 * @param {Object} options options
	 */
	constructor(options)
	{
		/** @private */
		this.matrix = null;
		/** @private */
		this.pointX = 1;
		/** @private */
		this.pointY = 1;
		/** @private */
		this.pointWidth = 11;
		/** @private */
		this.pointHeight = 11;
		/** @private */
		this.pointOpen = 3;
		/** @private */
		this.pointWorm = 2;
		/** @private */
		this.pointBorder = 0;
		/** @private */
		this.pointInside = 1;

		// Set options
		if (this.__checkTypeOf(options, 'Object')) {
			this.setOptions(options);
		}
	}

	/**
	 * Set default setting options
	 * @public
	 * @param {Object} options Set setting options
	 */
	setOptions(options)
	{
		// Set labyrinth size
		this.setSize(options);

		// Set labyrinth points
		this.setPoints(options);

		// Set starting point
		this.setStarting(options);
	}

	/**
	 * Size labyrinth there must be an odd number.
	 * Width more or equal 7
	 * Height more or equal 7
	 * @public
	 * @param {Object} options setting options
	 */
	setSize(options)
	{
		// Check options
		if (this.__checkTypeOf(options, 'Object') === false) {
			return false;
		}

		// Width
		if ( options.hasOwnProperty('width') ) {
			let width = parseInt(options.width);
			if ( width >= 7 ) {
				this.pointWidth = width;
			} else {
				console.warn('Invalid value: ' + options.width);
			}
		}

		// Height
		if ( options.hasOwnProperty('height') ) {
			let height = parseInt(options.height);
			if ( height >= 7 ) {
				this.pointHeight = height;
			} else {
				console.warn('Invalid value: ' + options.height);
			}
		}

		if ( this.pointWidth % 2 == 0 || this.pointHeight % 2 == 0 ) {
			throw 'Size "width" or "height" not odd number.';
		}
	}

	/**
	 * Set matrix points
	 * @public
	 * @param {Object} options setting options
	 */
	setPoints(options)
	{
		// Check options
		if (this.__checkTypeOf(options, 'Object') === false) {
			return false;
		}

		// Point border
		if ( options.hasOwnProperty('border') ) {
			// Border point
			let border = parseInt(options.border);
			if ( Number.isInteger(border) ) {
				this.pointBorder = border;
			} else {
				console.warn('Invalid value: ' + options.border);
			}
		}

		// Point inside
		if ( options.hasOwnProperty('inside') ) {
			// Inside point
			let inside = parseInt(options.inside);
			if ( Number.isInteger(inside) ) {
				this.pointInside = inside;
			} else {
				console.warn('Invalid value: ' + options.inside);
			}
		} else {
			// Random
			this.pointInside = 0;
			while ( this.pointInside == this.pointBorder ) {
				this.pointInside++;
			}
		}

		if ( this.pointBorder == this.pointInside ) {
			throw 'Point "border" equals "inside".'
		}

		// Set other points
		let points = new Array();
		points.push(this.pointBorder);
		points.push(this.pointInside);

		// Point worm
		this.pointWorm = 1;
		while ( points.indexOf(this.pointWorm) >= 0 ) {
			this.pointWorm++;
		}
		points.push(this.pointWorm);

		// Point open
		this.pointOpen = 1;
		while ( points.indexOf(this.pointOpen) >= 0 ) {
			this.pointOpen++;
		}
	}

	/**
	 * Set point starting
	 * @public
	 * @param {Object} options setting options
	 */
	setStarting(options)
	{
		// Check options
		if (this.__checkTypeOf(options, 'Object') === false) {
			return false;
		}

		if (options.hasOwnProperty('starting') === false) {
			return false;
		}

		let starting = parseInt(options.starting).toLocaleString();

		if (starting === 'lt') {
			// Left-top
			this.pointX = 1;
			this.pointY = 1;
		} else if (starting === 'rt') {
			// Right-top
			this.pointX = this.pointWidth - 1;
			this.pointY = 1;
		} else if (starting === 'lb') {
			// Left-bottom
			this.pointX = 1;
			this.pointY = this.pointHeight - 1;
		} else if (starting === 'rb') {
			// Right-bottom
			this.pointX = this.pointWidth - 1;
			this.pointY = this.pointHeight - 1;
		} else if (starting === 'cc') {
			// Center
			this.pointX = (this.pointWidth - 1) / 2;
			if (this.pointX % 2 == 0) {
				this.pointX--;
			}
			this.pointY = (this.pointHeight - 1) / 2;
			if (this.pointY % 2 == 0) {
				this.pointY--;
			}
		}
	}

	/**
	 * Start generate labyrinth
	 * @public
	 * @return {Array} labyrinth matrix
	 */
	generate(width, height)
	{
		if (this.__checkTypeOf(width, "Number") && this.__checkTypeOf(height, "Number")) {
			this.setSize({
				width: width,
				height: height
			});
		}

		// Stage #1
		this.__dataPreparation();

		// Stage #2
		this.__dataProcessing();

		return this.matrix;
	}

	/**
	 * Preparing data to create a matrix
	 * @private
	 */
	__dataPreparation()
	{
		// Create new empty matrix
		this.matrix = new Array(this.pointHeight);
		// Set default data to matrix
		for (let y = 0; y < this.pointHeight; ++y) {
			this.matrix[y] = new Array(this.pointWidth);
			for (let x = 0; x < this.pointWidth; ++x) {
				if (x % 2 == 1 && y % 2 == 1) {
					this.matrix[y][x] = this.pointOpen;
				} else {
					this.matrix[y][x] = this.pointBorder;
				}
			}
		}
	}

	/**
	 * Generation process labyrinth
	 * @private
	 */
	__dataProcessing()
	{
		let nextDirection;
		do {
			// Forward movement by set direction
			nextDirection = this.__getNextDirection(this.pointOpen, 2);
			if (nextDirection > 0) {
				this.__makeNextStep(nextDirection, this.pointWorm);
			} else {
				// Backward movement by set direction
				nextDirection = this.__getNextDirection(this.pointWorm, 1);
				if (nextDirection > 0) {
					this.__makeNextStep(nextDirection, this.pointInside);
				}
			}
		} while (nextDirection > 0);
		// Set finish point
		this.matrix[this.pointY][this.pointX] = this.pointInside;
	}

	/**
	 * Check variable type
	 * @private
	 * @param {Mixed} variable - Any variable
	 * @param {String} type - Check type
	 * @return {Boolean} Check result
	 */
	__checkTypeOf(variable, type = "")
	{
		let typeType = new Object().toString.call(type).slice(8, -1);
		let variableType = new Object().toString.call(variable).slice(8, -1);

		if (typeType === "String" && type.length > 0) {
			return (variableType.toLowerCase() === type.toLowerCase());
		}

		return variableType;
	}

	/**
	 * Return random number in set range number
	 * @private
	 * @param {Number} a Input number
	 * @param {Number} b Input number
	 */
	__getRandomNumber(a = 0, b = 1)
	{
		return Math.floor( Math.random() * ( b - a ) ) + a;
	}

	/**
	 * Return direction next step
	 * @private
	 * @param {Number} point 
	 * @param {Number} step 
	 * @return {Number}
	 */
	__getNextDirection(point, step = 2)
	{
		// Array directions
		let directions = new Array();
		// Move to up
		if (this.pointY-step > 0 && this.matrix[this.pointY-step][this.pointX] == point) {
			directions.push(1);
		}
		// Move to right
		if (this.pointX+step < this.pointWidth && this.matrix[this.pointY][this.pointX+step] == point) {
			directions.push(2);
		}
		// Move to down
		if (this.pointY+step < this.pointHeight && this.matrix[this.pointY+step][this.pointX] == point) {
			directions.push(3);
		}
		// Move to left
		if (this.pointX-step > 0 && this.matrix[this.pointY][this.pointX-step] == point) {
			directions.push(4);
		}
		// No direction
		if (directions.length == 0) {
			return 0;
		}
		// Random direction
		let index = this.__getRandomNumber(0, directions.length);

		return directions[index];
	}

	/**
	 * Make next step
	 * @private
	 * @param {Number} direction 
	 * @param {Number} point 
	 */
	__makeNextStep( direction, point )
	{
		if ( direction == 1 ) {
			// Move to up
			this.matrix[this.pointY--][this.pointX] = point;
			this.matrix[this.pointY--][this.pointX] = point;
		} else if ( direction == 2 ) {
			// Move to right
			this.matrix[this.pointY][this.pointX++] = point;
			this.matrix[this.pointY][this.pointX++] = point;
		} else if ( direction == 3 ) {
			// Move to down
			this.matrix[this.pointY++][this.pointX] = point;
			this.matrix[this.pointY++][this.pointX] = point;
		} else if ( direction == 4 ) {
			// Move to left
			this.matrix[this.pointY][this.pointX--] = point;
			this.matrix[this.pointY][this.pointX--] = point;
		} else {
			return false;
		}

		return true;
	}
}
